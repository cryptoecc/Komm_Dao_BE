#!/bin/bash

# Check if Python is installed
if ! command -v python3 &>/dev/null; then
    echo "Python 3 is not installed. Please install Python 3."
    exit 1
fi

# Create virtual environment only if it doesn't exist
if [ ! -d "myenv" ]; then
    python3 -m venv myenv
    echo "Virtual environment 'myenv' created."
else
    echo "Virtual environment 'myenv' already exists."
fi

# Activate the virtual environment
source myenv/bin/activate

# Upgrade pip to the latest version
pip install --upgrade pip

# Install dependencies from requirements.txt
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Please make sure it exists in the project root."
    exit 1
fi

echo "Setup complete. Virtual environment 'myenv' is ready and packages are installed."
echo "To activate the virtual environment, run 'source myenv/bin/activate'."
