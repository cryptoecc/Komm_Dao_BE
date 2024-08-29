import pandas as pd
import requests
import os
import configparser
import logging
import subprocess
from difflib import SequenceMatcher
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)

class TwitterProcessor:
    
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.read('config.ini')
        self.target_date = datetime.now().date()
        self.API_KEY = self.config.get('API', 'openai_api_key')
        self.local_path = self.config.get('Paths', 'local_path')
        print("TwitterProcessor initialized")
        
    def get_file_from_remote_server(self):
        remote_server = self.config.get('Remote', 'server')
        remote_file_path = f"/root/phantom/output/{self.target_date}_twitter_result.csv"
        local_file_path = self.local_path

        command = [
            "scp",
            f"{remote_server}:{remote_file_path}",
            local_file_path
        ]

        try:
            subprocess.run(command, check=True)
            logging.info("File transfer completed successfully.")
        except subprocess.CalledProcessError as e:
            logging.error(f"Error during file transfer: {e}")

    def process_twitter_data(self):
        # 현재 날짜를 yyyy-mm-dd 형식으로 가져와서 파일 이름에 반영
        current_date_str = datetime.now().strftime('%Y-%m-%d')
        FILE_PATH = f"{self.local_path}/{current_date_str}_twitter_result.csv"

        if not os.path.exists(FILE_PATH):
            self.get_file_from_remote_server()

        try:
            df = pd.read_csv(FILE_PATH)
            if df.empty:
                logging.error(f"Error: {FILE_PATH} is empty.")
                return None
        except pd.errors.EmptyDataError:
            logging.error(f"Error: {FILE_PATH} contains no valid data.")
            return None

        df = df.drop_duplicates(subset='profileUrl')

        # 제외 대상은 달라질 수 있음
        df = df[df['query'] != 'https://twitter.com/xiaweb3']

        # query 칼럼명을 requester로 변경
        df = df.rename(columns={'query': 'requester'})
        results = []

        for _, row in df.iterrows():
            bio = row['bio']
            website = row['website']
            profileUrl = row['profileUrl']
            screenName = row['screenName']
            name = row['name']
            prompt = (f"Context:\n\n"
                      f"The following information is for a Twitter account:\n"
                      f"Bio: {bio}\n"
                      f"Website: {website}\n"
                      f"Profile URL: {profileUrl}\n"
                      f"name: {name}\n"
                      f"screenName: {screenName}\n\n"
                      f"Goal: Return 'TRUE' if it is likely a corporate account, or 'FALSE' otherwise.\n\n"
                      f"Instructions:\n"
                      f"1. Analyze the bio to assess whether it suggests the account represents an organization or an individual.\n"
                      f"2. Check the both 'screenName' and 'name' to determine if it resembles a name typically used for a company.\n\n"
                      f"IMPORTANT: Your response should be strictly 'TRUE' or 'FALSE' without any additional text, explanation, or commentary.")

            result = self.query_openai(prompt)
            results.append({
                'profileUrl': profileUrl,
                'isCorporate': result
            })

        results_df = pd.DataFrame(results)
        merged_df = df.merge(results_df, on='profileUrl', how='left')
        selected_columns = ['profileUrl', 'screenName', 'name', 'backgroundImg', 'bio', 'website', 'requester', 'timestamp', 'isCorporate']
        final_df = merged_df[selected_columns]

        # 웹 API에서 받은 이름 리스트를 받아와서 비교 (여기서는 가정된 예로, 실제 데이터로 대체 필요)
        api_names = ['ExampleCorp', 'SampleTech', 'DemoOrg']  # 이 부분을 실제 API 데이터로 대체해야 합니다.
        final_df['is_invested'] = final_df['screenName'].apply(lambda x: self.is_name_similar(x, api_names))
        
        print(final_df)
        final_df.to_csv(f"{self.local_path}/{current_date_str}_twitter_output.csv", index=False, encoding='utf-8-sig')
        return final_df    
    
    def query_openai(self, prompt):
        headers = {
            'Authorization': f'Bearer {self.API_KEY}',
            'Content-Type': 'application/json',
        }
        data = {
            'model': 'gpt-4o',
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 10
        }
        # 요청 전 로깅
        logging.info("Sending request to OpenAI with prompt: %s", prompt)
        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
        # 응답 후 로깅
        logging.info("Received response from OpenAI: %s", response.text)
        response_json = response.json()
        return response_json['choices'][0]['message']['content'].strip()

    def is_name_similar(self, name, api_names, threshold=0.6):
        return any(SequenceMatcher(None, name, api_name).ratio() >= threshold for api_name in api_names)


class GitHubProcessor:

    GITHUB_API_URL = "https://api.github.com/search/repositories"
    KEYWORDS = ["solidity", "erc20", "web3", "decentralized", "defi", "onchain", "on-chain", "blockchain", "crypto"]
    
    def __init__(self):
        print("GitHubProcessor initialized")
        
    def search_github_repositories(self, keyword, target_date):
        created_since = target_date.isoformat().split('T')[0]
        params = {
            "q": f"{keyword} created:>{created_since}",
            "sort": "created",
            "order": "desc"
        }
        headers = {
            "Accept": "application/vnd.github.v3+json"
        }

        request_url = f"{self.GITHUB_API_URL}?q={keyword}+created:>{created_since}&sort=created&order=desc"
        print(f"Request URL: {request_url}")

        response = requests.get(self.GITHUB_API_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
  
    def convert_to_dataframe(self, new_repos):
        data = []
        for repo in new_repos:
            data.append({
                'Name': repo['name'],
                'URL': repo['html_url'],
                'Description': repo.get('description', 'N/A'),
                'Created_At': repo['created_at']
            })

        df = pd.DataFrame(data)
        return df

    def process_github_data(self):
        all_new_repos = []
        for keyword in self.KEYWORDS:
            print(f"Searching for keyword: {keyword}")
            target_date = datetime.now() - timedelta(days=1)
            results = self.search_github_repositories(keyword, target_date)
            new_repos = results.get('items', [])
            print(f"Found {len(new_repos)} new repositories for keyword: {keyword}")
            all_new_repos.extend(new_repos)

        if all_new_repos:
            df = self.convert_to_dataframe(all_new_repos)
            print(df)
            return df

        return pd.DataFrame()
    

# TwitterProcessor와 GitHubProcessor 사용
columns = ["project_name", "summary", "category", "website", "twitter", "discord", "github", "founders_info", "linkedin", 
           "fundraising_amount", "valuation", "investors", "is_invested", "source"]
output = pd.DataFrame(columns=columns)

twitter_process = TwitterProcessor()
twitter_df = twitter_process.process_twitter_data()

if twitter_df is not None and len(twitter_df) > 0:
    filtered_df = twitter_df[twitter_df['isCorporate'].astype(bool) == True]
    
    new_rows = []
    for _, row in filtered_df.iterrows():
        new_row = {
            "project_name": row['screenName'],
            "summary": row['bio'],
            "category": None,
            "website": row['website'],
            "twitter": row['profileUrl'],
            "discord": None,
            "github": None,
            "founders_info": None,
            "linkedin": None,
            "fundraising_amount": None,
            "valuation": None,
            "investors": None,
            "is_invested": row['is_invested'],
            "source": "twitter"
        }
        new_rows.append(new_row)
    
    output = pd.concat([output, pd.DataFrame(new_rows)], ignore_index=True)

print(output)

github_process = GitHubProcessor()
github_df = github_process.process_github_data()

if len(github_df) > 0:
    new_rows = []
    for _, row in github_df.iterrows():
        new_row = {
            "project_name": row['Name'],
            "summary": row['Description'],
            "category": None,
            "website": None,
            "twitter": None,
            "discord": None,
            "github": row['URL'],
            "founders_info": None,
            "linkedin": None,
            "fundraising_amount": None,
            "valuation": None,
            "investors": None,
            "is_invested": None,
            "source": "github"
        }
        new_rows.append(new_row)
    
    output = pd.concat([output, pd.DataFrame(new_rows)], ignore_index=True)

print(output)

config = configparser.ConfigParser()
config.read('config.ini')
target_date = datetime.now().date()
local_path = config.get('Paths', 'local_path')
output.to_csv(f'{local_path}/{target_date}_lecca_output.csv', index=False, encoding='utf-8-sig')
