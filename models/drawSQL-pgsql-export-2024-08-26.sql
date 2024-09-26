CREATE TABLE "DEAL_INFO"(
    "deal_id" FLOAT(53) NOT NULL,
    "pjt_id" FLOAT(53) NULL,
    "deal_name" VARCHAR(255) NOT NULL,
    "deal_round" VARCHAR(255) NOT NULL,
    "deal_logo" VARCHAR(255) NOT NULL,
    "deal_background" VARCHAR(255) NOT NULL,
    "min_interest" VARCHAR(255) NOT NULL,
    "max_interest" VARCHAR(255) NOT NULL,
    "deal_summary" VARCHAR(255) NULL,
    "deal_desc" VARCHAR(255) NULL,
    "deal_status" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL DEFAULT 'create_date',
    "end_date" DATE NOT NULL,
    "create_date" DATE NULL,
    "update_date" DATE NOT NULL,
    "total_interest" FLOAT(53) NOT NULL,
    "final_cap" FLOAT(53) NOT NULL,
    "total_cur_paid" FLOAT(53) NOT NULL,
    "payment_due_date" DATE NOT NULL
);
ALTER TABLE
    "DEAL_INFO" ADD PRIMARY KEY("deal_id");
COMMENT
ON COLUMN
    "DEAL_INFO"."deal_name" IS 'deal_name = project_name + deal_round';
COMMENT
ON COLUMN
    "DEAL_INFO"."deal_round" IS 'COMM_CODE = DEAL_ROUND DEAL_PRESEED DEAL_SEED DEAL_PRIVATE DEAL_ST DEAL_S_A DEAL_S_B DEAL_S_C';
COMMENT
ON COLUMN
    "DEAL_INFO"."deal_status" IS 'comm_code = deal_status RAISING - ADMIN - CLOSED';
COMMENT
ON COLUMN
    "DEAL_INFO"."start_date" IS 'start_date = create_date';
COMMENT
ON COLUMN
    "DEAL_INFO"."end_date" IS 'end_date = deadline date';
CREATE TABLE "PROJECT_INFO"(
    "create_date" DATE NOT NULL,
    "pjt_id" INTEGER NOT NULL,
    "pjt_name" VARCHAR(255) NULL,
    "website" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "x_link" VARCHAR(255) NOT NULL,
    "x_followers" FLOAT(53) NULL,
    "discord_link" VARCHAR(255) NOT NULL,
    "discord_members" FLOAT(53) NOT NULL,
    "linkedIn_link" VARCHAR(255) NOT NULL,
    "github_link" VARCHAR(255) NOT NULL,
    "github_stars" FLOAT(53) NOT NULL,
    "github_wkly_comm" VARCHAR(255) NOT NULL,
    "raising_amount" VARCHAR(255) NOT NULL,
    "valuation" VARCHAR(255) NOT NULL,
    "investors" VARCHAR(255) NOT NULL,
    "pjt_grade" VARCHAR(255) NULL,
    "pjt_summary" VARCHAR(255) NOT NULL,
    "pjt_details" VARCHAR(255) NOT NULL,
    "adm_trend" VARCHAR(255) NOT NULL,
    "adm_expertise" VARCHAR(255) NOT NULL,
    "adm_final_grade" VARCHAR(255) NOT NULL,
    "update_date" DATE NOT NULL DEFAULT 'N',
    "update_yn" VARCHAR(255) NOT NULL,
    "apply_date" DATE NOT NULL,
    "apply_yn" VARCHAR(255) NOT NULL,
    "total_rating" BIGINT NOT NULL,
    "total_per" BIGINT NOT NULL
);
ALTER TABLE
    "PROJECT_INFO" ADD PRIMARY KEY("pjt_id");
CREATE TABLE "KOHORT_INFO"(
    "kohort_id" INTEGER NOT NULL,
    "komm_id" INTEGER NOT NULL,
    "kohort_name" VARCHAR(255) NULL,
    "max_participant" INTEGER NOT NULL DEFAULT 'OP',
    "kohort_desc" VARCHAR(255) NULL,
    "leader_user_id" INTEGER NULL,
    "leader_TG_id" VARCHAR(255) NOT NULL,
    "start_date" DATE NULL,
    "end_date" DATE NULL,
    "kohort_logo" TEXT NOT NULL,
    "kohort_banner" TEXT NOT NULL
);
ALTER TABLE
    "KOHORT_INFO" ADD PRIMARY KEY("kohort_id");
CREATE TABLE "DELEGATE_INFO"(
    "delegate_id" FLOAT(53) NOT NULL,
    "delegate_from" FLOAT(53) NOT NULL,
    "delegate_to" FLOAT(53) NOT NULL,
    "delegate_transaction_id" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "DELEGATE_INFO" ADD PRIMARY KEY("delegate_id");
CREATE TABLE "USER_WATCHLIST"(
    "watch_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pjt_id" INTEGER NULL,
    "create_date" DATE NOT NULL,
    "update_Date" DATE NOT NULL
);
ALTER TABLE
    "USER_WATCHLIST" ADD PRIMARY KEY("watch_id");
ALTER TABLE
    "USER_WATCHLIST" ADD PRIMARY KEY("user_id");
CREATE TABLE "KOHORT_MEMBERS"(
    "kohort_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "appr_status" VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    "appr_date" DATE NOT NULL,
    "leader_yn" VARCHAR(255) NOT NULL,
    "performance" FLOAT(53) NOT NULL,
    "personal_xp" FLOAT(53) NOT NULL,
    "xp_confirm" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "KOHORT_MEMBERS" ADD PRIMARY KEY("kohort_id");
ALTER TABLE
    "KOHORT_MEMBERS" ADD PRIMARY KEY("user_id");
COMMENT
ON COLUMN
    "KOHORT_MEMBERS"."appr_status" IS 'appr_status PENDING Pending activate_yn = \'' N \ '' appr_status APPLIED Completed(Apply) activate_yn = \ '' Y \ '' appr_status DENIED Completed(Deny) activate_yn = \ '' N \ '' appr_status DELETED Deleted activate_yn = \ '' N \ ';
CREATE TABLE "ADMIN_USER"(
    "admin_id" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);
ALTER TABLE
    "ADMIN_USER" ADD PRIMARY KEY("admin_id");
CREATE INDEX "admin_user_user_id_index" ON
    "ADMIN_USER"("user_id");
CREATE TABLE "CALENDAR_INFO"(
    "cal_id" INTEGER NOT NULL,
    "pjt_id" INTEGER NOT NULL,
    "pjt_name" VARCHAR(255) NULL,
    "key_word" VARCHAR(255) NOT NULL,
    "cal_detail" VARCHAR(255) NOT NULL,
    "x_link" VARCHAR(255) NOT NULL,
    "x_detail_link" VARCHAR(255) NOT NULL,
    "create_date" DATE NULL,
    "update_date" DATE NOT NULL
);
ALTER TABLE
    "CALENDAR_INFO" ADD PRIMARY KEY("cal_id");
ALTER TABLE
    "CALENDAR_INFO" ADD PRIMARY KEY("pjt_id");
CREATE TABLE "CONTRIBUTION_MISSIONS"(
    "ms_id" INTEGER NOT NULL,
    "cont_id" INTEGER NOT NULL,
    "ms_type" VARCHAR(255) NOT NULL,
    "ms_yn" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "CONTRIBUTION_MISSIONS" ADD PRIMARY KEY("ms_id");
ALTER TABLE
    "CONTRIBUTION_MISSIONS" ADD PRIMARY KEY("cont_id");
CREATE TABLE "USER_DEAL_INTEREST"(
    "deal_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_interest" FLOAT(53) NOT NULL,
    "user_final_alloc" FLOAT(53) NULL,
    "payment_amount" FLOAT(53) NOT NULL,
    "payment_status" VARCHAR(255) NULL,
    "payment_link" VARCHAR(255) NULL,
    "create_date" DATE NULL,
    "update_date" DATE NOT NULL
);
ALTER TABLE
    "USER_DEAL_INTEREST" ADD PRIMARY KEY("deal_id");
ALTER TABLE
    "USER_DEAL_INTEREST" ADD PRIMARY KEY("user_id");
COMMENT
ON COLUMN
    "USER_DEAL_INTEREST"."user_interest" IS 'update \uac00\ub2a5';
CREATE TABLE "USER_CONTRIBUTION"(
    "cont_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ms_id" INTEGER NOT NULL,
    "cont_type" VARCHAR(255) NOT NULL,
    "claim_yn" VARCHAR(255) NULL DEFAULT 'N',
    "cont_xp" FLOAT(53) NULL
);
ALTER TABLE
    "USER_CONTRIBUTION" ADD PRIMARY KEY("cont_id");
ALTER TABLE
    "USER_CONTRIBUTION" ADD PRIMARY KEY("user_id");
ALTER TABLE
    "USER_CONTRIBUTION" ADD PRIMARY KEY("ms_id");
CREATE TABLE "USER_EMAIL_LOG"(
    "send_seq" INTEGER NOT NULL,
    "request_dt" INTEGER NOT NULL,
    "from_addr" VARCHAR(100) NOT NULL,
    "to_addr" VARCHAR(100) NOT NULL,
    "pin_code" VARCHAR(10) NOT NULL,
    "pin_expiry" INTEGER NOT NULL,
    "send_stat_cd" VARCHAR(6) NOT NULL,
    "send_stat_cd_nm" VARCHAR(30) NOT NULL,
    "registed_by" VARCHAR(100) NULL,
    "regist_date" INTEGER NULL,
    "modified_by" VARCHAR(100) NULL,
    "modify_date" INTEGER NULL
);
ALTER TABLE
    "USER_EMAIL_LOG" ADD PRIMARY KEY("send_seq");
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."request_dt" IS '\ubc1c\uc1a1\uc694\uccad\uc77c\uc2dc';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."from_addr" IS '\ubc1c\uc1a1\uba54\uc77c\uc8fc\uc18c';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."to_addr" IS '\uc218\uc2e0\uba54\uc77c\uc8fc\uc18c';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."pin_code" IS 'PIN \ucf54\ub4dc';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."pin_expiry" IS 'PIN \ub9cc\ub8cc \uc77c\uc2dc';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."send_stat_cd" IS '\ubc1c\uc1a1\uc0c1\ud0dc\ucf54\ub4dc';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."send_stat_cd_nm" IS '\ubc1c\uc1a1\uc0c1\ud0dc\ucf54\ub4dc\uba85';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."registed_by" IS '\ub4f1\ub85d\uc790';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."regist_date" IS '\ub4f1\ub85d\uc77c\uc790';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."modified_by" IS '\uc218\uc815\uc790';
COMMENT
ON COLUMN
    "USER_EMAIL_LOG"."modify_date" IS '\uc218\uc815\uc77c\uc790';
CREATE TABLE "CONTRIBUTION_INFO"(
    "cont_id" INTEGER NOT NULL,
    "pjt_id" INTEGER NULL,
    "pjt_name" VARCHAR(255) NULL,
    "cont_category" VARCHAR(255) NULL,
    "cont_type" VARCHAR(255) NULL,
    "max_participant" INTEGER NOT NULL,
    "cont_logo" TEXT NULL,
    "cont_banner" TEXT NOT NULL,
    "cont_desc" VARCHAR(255) NOT NULL,
    "start_date" DATE NULL,
    "end_date" DATE NULL,
    "cont_xp" FLOAT(53) NULL,
    "cont_status" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "CONTRIBUTION_INFO" ADD PRIMARY KEY("cont_id");
COMMENT
ON COLUMN
    "CONTRIBUTION_INFO"."cont_type" IS 'COMM_CODE = CONT_TYPE CON_COM_ENA CON_NOD_VAL CON_RES CON_MAR';
CREATE TABLE "USER_RATING"(
    "pjt_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rated_value" FLOAT(53) NULL,
    "rating_yn" VARCHAR(255) NOT NULL,
    "rated_date" DATE NOT NULL
);
ALTER TABLE
    "USER_RATING" ADD PRIMARY KEY("pjt_id");
ALTER TABLE
    "USER_RATING" ADD PRIMARY KEY("user_id");
CREATE TABLE "PROPOSAL_INFO"(
    "prop_id" FLOAT(53) NOT NULL,
    "prop_title" VARCHAR(255) NULL,
    "prop_desc" VARCHAR(255) NOT NULL,
    "voted_strategy" VARCHAR(255) NULL,
    "transaction_id" VARCHAR(255) NULL,
    "prop_status" VARCHAR(255) NULL,
    "create_user_id" FLOAT(53) NULL,
    "create_date" DATE NULL,
    "start_date" DATE NULL,
    "end_date" DATE NULL,
    "excuted_date" DATE NULL
);
ALTER TABLE
    "PROPOSAL_INFO" ADD PRIMARY KEY("prop_id");
CREATE TABLE "USER_INFO"(
    "user_id" INTEGER NOT NULL,
    "user_name" VARCHAR(255) NULL,
    "email_addr" VARCHAR(255) NULL,
    "wallet_addr" VARCHAR(255) NULL,
    "expertise" VARCHAR(255) NULL,
    "bio" VARCHAR(255) NULL,
    "value_add" VARCHAR(255) NOT NULL,
    "reg_date" DATE NULL,
    "appr_status" VARCHAR(255) NULL DEFAULT 'PENDING',
    "cur_xp" INTEGER NULL,
    "grade" VARCHAR(255) NOT NULL,
    "portion" INTEGER NOT NULL,
    "nft_link" VARCHAR(255) NULL,
    "user_image_link" TEXT NOT NULL,
    "voting_power" INTEGER NOT NULL,
    "activate_yn" VARCHAR(255) NULL DEFAULT 'N',
    "last_login_date" DATE NULL
);
ALTER TABLE
    "USER_INFO" ADD PRIMARY KEY("user_id");
COMMENT
ON COLUMN
    "USER_INFO"."expertise" IS 'COMM_CODE = USER_EXPERTISE USER_INV USER_RES USER_DEV USER_MAR USER_DES USER_LAW USER_HH';
COMMENT
ON COLUMN
    "USER_INFO"."appr_status" IS 'appr_status PENDING Pending activate_yn = \'' N \ '' appr_status APPLIED Completed(Apply) activate_yn = \ '' Y \ '' appr_status DENIED Completed(Deny) activate_yn = \ '' N \ '' appr_status DELETED Deleted activate_yn = \ '' N \ ';
COMMENT
ON COLUMN
    "USER_INFO"."voting_power" IS 'update vote power';
COMMENT
ON COLUMN
    "USER_INFO"."activate_yn" IS 'active user  ( approval user )';
CREATE TABLE "USER_PROPOSAL"(
    "prop_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vote_status" VARCHAR(255) NOT NULL,
    "comments" TEXT NOT NULL,
    "voted_power" INTEGER NULL
);
ALTER TABLE
    "USER_PROPOSAL" ADD PRIMARY KEY("prop_id");
ALTER TABLE
    "USER_PROPOSAL" ADD PRIMARY KEY("user_id");
COMMENT
ON COLUMN
    "USER_PROPOSAL"."vote_status" IS 'comm_code = vote_status';
CREATE TABLE "KOMMITTEE_INFO"(
    "komm_id" INTEGER NOT NULL,
    "komm_ver" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "komm_name" VARCHAR(255) NOT NULL,
    "komm_desc" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "komm_ver" VARCHAR(255) NOT NULL,
    "create_date" DATE NOT NULL,
    "update_date" DATE NOT NULL
);
ALTER TABLE
    "KOMMITTEE_INFO" ADD PRIMARY KEY("komm_id");
ALTER TABLE
    "KOMMITTEE_INFO" ADD PRIMARY KEY("user_id");
COMMENT
ON COLUMN
    "KOMMITTEE_INFO"."komm_ver" IS 'S1 ,  S2 ...';
COMMENT
ON COLUMN
    "KOMMITTEE_INFO"."komm_name" IS 'komm_name GOV governance komm_name TRE treasury komm_name PRO program';
ALTER TABLE
    "PROPOSAL_INFO" ADD CONSTRAINT "proposal_info_prop_id_foreign" FOREIGN KEY("prop_id") REFERENCES "USER_PROPOSAL"("prop_id");
ALTER TABLE
    "USER_DEAL_INTEREST" ADD CONSTRAINT "user_deal_interest_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "CONTRIBUTION_INFO" ADD CONSTRAINT "contribution_info_pjt_id_foreign" FOREIGN KEY("pjt_id") REFERENCES "PROJECT_INFO"("pjt_id");
ALTER TABLE
    "KOHORT_MEMBERS" ADD CONSTRAINT "kohort_members_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "USER_WATCHLIST" ADD CONSTRAINT "user_watchlist_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "KOHORT_MEMBERS" ADD CONSTRAINT "kohort_members_kohort_id_foreign" FOREIGN KEY("kohort_id") REFERENCES "KOHORT_INFO"("kohort_id");
ALTER TABLE
    "USER_RATING" ADD CONSTRAINT "user_rating_pjt_id_foreign" FOREIGN KEY("pjt_id") REFERENCES "PROJECT_INFO"("pjt_id");
ALTER TABLE
    "CALENDAR_INFO" ADD CONSTRAINT "calendar_info_pjt_name_foreign" FOREIGN KEY("pjt_name") REFERENCES "PROJECT_INFO"("pjt_name");
ALTER TABLE
    "DELEGATE_INFO" ADD CONSTRAINT "delegate_info_delegate_from_foreign" FOREIGN KEY("delegate_from") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "DEAL_INFO" ADD CONSTRAINT "deal_info_deal_id_foreign" FOREIGN KEY("deal_id") REFERENCES "USER_DEAL_INTEREST"("deal_id");
ALTER TABLE
    "DEAL_INFO" ADD CONSTRAINT "deal_info_pjt_id_foreign" FOREIGN KEY("pjt_id") REFERENCES "PROJECT_INFO"("pjt_id");
ALTER TABLE
    "USER_RATING" ADD CONSTRAINT "user_rating_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "KOHORT_INFO" ADD CONSTRAINT "kohort_info_komm_id_foreign" FOREIGN KEY("komm_id") REFERENCES "KOMMITTEE_INFO"("komm_id");
ALTER TABLE
    "ADMIN_USER" ADD CONSTRAINT "admin_user_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "USER_PROPOSAL" ADD CONSTRAINT "user_proposal_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "USER_CONTRIBUTION" ADD CONSTRAINT "user_contribution_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "PROJECT_INFO" ADD CONSTRAINT "project_info_pjt_id_foreign" FOREIGN KEY("pjt_id") REFERENCES "CALENDAR_INFO"("pjt_id");
ALTER TABLE
    "PROPOSAL_INFO" ADD CONSTRAINT "proposal_info_create_user_id_foreign" FOREIGN KEY("create_user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "USER_CONTRIBUTION" ADD CONSTRAINT "user_contribution_cont_id_foreign" FOREIGN KEY("cont_id") REFERENCES "CONTRIBUTION_INFO"("cont_id");
ALTER TABLE
    "CALENDAR_INFO" ADD CONSTRAINT "calendar_info_x_link_foreign" FOREIGN KEY("x_link") REFERENCES "PROJECT_INFO"("x_link");
ALTER TABLE
    "USER_WATCHLIST" ADD CONSTRAINT "user_watchlist_pjt_id_foreign" FOREIGN KEY("pjt_id") REFERENCES "PROJECT_INFO"("pjt_id");
ALTER TABLE
    "USER_INFO" ADD CONSTRAINT "user_info_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "KOMMITTEE_INFO"("user_id");
ALTER TABLE
    "KOHORT_INFO" ADD CONSTRAINT "kohort_info_leader_user_id_foreign" FOREIGN KEY("leader_user_id") REFERENCES "USER_INFO"("user_id");
ALTER TABLE
    "CONTRIBUTION_MISSIONS" ADD CONSTRAINT "contribution_missions_cont_id_foreign" FOREIGN KEY("cont_id") REFERENCES "CONTRIBUTION_INFO"("cont_id");
ALTER TABLE
    "USER_CONTRIBUTION" ADD CONSTRAINT "user_contribution_ms_id_foreign" FOREIGN KEY("ms_id") REFERENCES "CONTRIBUTION_MISSIONS"("ms_id");
ALTER TABLE
    "DELEGATE_INFO" ADD CONSTRAINT "delegate_info_delegate_to_foreign" FOREIGN KEY("delegate_to") REFERENCES "USER_INFO"("user_id");