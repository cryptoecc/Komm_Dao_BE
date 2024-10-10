require("dotenv").config();
const {
  DealInfo,
  UserDealInterest,
  UserInfo,
} = require("../../../../../models/index");
const cron = require("node-cron");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const moment = require("moment");

exports.createDeal = async (req, res) => {
  try {
    // 이미지 파일 경로 설정
    const profileImageLink = req.files.profileImage
      ? `uploads/deal/${req.files.profileImage[0].filename}`
      : `uploads/deal/logo_default.png`;

    const bannerImageLink = req.files.bannerImage
      ? `uploads/deal/${req.files.bannerImage[0].filename}`
      : `uploads/deal/banner_default.png`;

    // 요청 데이터 받기
    const {
      pjt_id,
      pjt_name,
      deal_round,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
    } = req.body;

    // 데이터베이스에 새로운 Deal 저장
    const newDeal = await DealInfo.create({
      pjt_id, // Project ID를 정수로 변환
      deal_name: pjt_name,
      deal_round,
      deal_logo: profileImageLink,
      deal_background: bannerImageLink,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
      create_date: new Date(),
    });

    res
      .status(201)
      .json({ message: "Deal created successfully", deal: newDeal });
  } catch (error) {
    console.error("Error creating deal:", error);
    res
      .status(500)
      .json({ message: "Failed to create deal", error: error.message });
  }
};

exports.dealList = async (req, res) => {
  try {
    // Fetch deals from the database
    const deals = await DealInfo.findAll();

    // Log the raw deals data
    console.log("Raw deals data:", deals);

    // Transform the deals into the desired format, if necessary
    const transformedDeals = deals.map((deal) => ({
      pjt_id: deal.pjt_id,
      deal_id: deal.deal_id,
      deal_name: deal.deal_name,
      deal_desc: deal.deal_desc,
      deal_summary: deal.deal_summary,
      total_interest: deal.total_interest || 0, // default 값 추가
      percentage:
        deal.total_interest && deal.final_cap
          ? Math.round((deal.total_interest / deal.final_cap) * 100)
          : 0, // 만약 값이 없을 때 0으로 설정
      end_date: deal.end_date,
      deal_logo_url: deal.deal_logo || "", // deal_logo 전달
      deal_banner_url: deal.deal_background || "",
      deal_status: deal.deal_status || "PENDING", // deal 상태 전달
      deal_round: deal.deal_round || "N/A", // deal 라운드 전달
    }));

    // Log the transformed deals data
    console.log("Transformed deals data:", transformedDeals);

    // Send the deals as the response
    res.json(transformedDeals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    // Deal ID를 가져옵니다.
    const { dealId } = req.params;

    // 파일이 존재하는지 확인하고 경로 설정
    const profileImageLink = req.files.profileImage
      ? `uploads/deal/${req.files.profileImage[0].filename}`
      : null; // 파일이 없다면 업데이트하지 않음

    const bannerImageLink = req.files.bannerImage
      ? `uploads/deal/${req.files.bannerImage[0].filename}`
      : null; // 파일이 없다면 업데이트하지 않음

    // 요청된 데이터 추출
    const {
      pjt_id,
      pjt_name,
      deal_round,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
    } = req.body;

    // 업데이트할 데이터를 정의합니다.
    const updateData = {
      pjt_id, // Project ID 업데이트
      deal_name: pjt_name, // Deal Name 업데이트
      deal_round,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
    };

    // 이미지가 제공되면 업데이트 데이터에 추가
    if (profileImageLink) {
      updateData.deal_logo = profileImageLink;
    }
    if (bannerImageLink) {
      updateData.deal_background = bannerImageLink;
    }

    // Deal 정보 업데이트
    const updatedDeal = await DealInfo.update(updateData, {
      where: { deal_id: dealId },
    });

    if (updatedDeal[0] === 0) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // 업데이트 성공
    res
      .status(200)
      .json({ message: "Deal updated successfully", deal: updateData });
  } catch (error) {
    console.error("Error updating deal:", error);
    res
      .status(500)
      .json({ message: "Failed to update deal", error: error.message });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const { dealId } = req.params;

    // Deal 삭제
    const deleted = await DealInfo.destroy({
      where: { deal_id: dealId },
    });

    // 삭제되지 않은 경우, 에러 처리
    if (!deleted) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res
      .status(500)
      .json({ message: "Failed to delete deal", error: error.message });
  }
};

exports.getDealInterest = async (req, res) => {
  try {
    // DEAL_INFO와 USER_DEAL_INTEREST, USER 테이블을 조인하여 데이터를 가져오기
    const dealInterests = await DealInfo.findAll({
      attributes: [
        "deal_id",
        "deal_name",
        "deal_status",
        "total_interest",
        "final_cap",
        "payment_due_date",
      ],
      include: [
        {
          model: UserDealInterest,
          as: "dealInterests", // alias 명시
          required: false, // LEFT JOIN을 통해 딜에 투자된 정보가 없어도 가져옴
          attributes: [
            "user_id",
            "user_interest",
            "user_final_alloc",
            "payment_status",
            "payment_amount",
            "payment_link",
          ],
          include: [
            {
              model: UserInfo, // USER 테이블을 조인하여 user_name 가져오기
              required: false, // LEFT JOIN을 통해 user 정보가 없어도 가져옴
              as: "user",
              attributes: ["user_name"], // 필요한 필드만 가져옴
            },
          ],
        },
      ],
    });

    // 데이터가 없거나 유효하지 않을 경우 빈 배열로 설정
    if (!dealInterests || dealInterests.length === 0) {
      return res.status(200).json([]);
    }

    // 데이터를 변환하여 클라이언트에 맞는 형태로 정리
    const formattedData = dealInterests.map((deal) => {
      // deal.dealInterests가 존재하지 않는 경우에도 빈 배열을 처리
      if (
        !deal.dealInterests ||
        !Array.isArray(deal.dealInterests) ||
        deal.dealInterests.length === 0
      ) {
        // USER_DEAL_INTEREST에 데이터가 없는 경우에도 DEAL_INFO 데이터를 포함한 기본 값 반환
        return {
          deal_id: deal.deal_id,
          deal_name: deal.deal_name,
          deal_status: deal.deal_status,
          final_cap: deal.final_cap || "--",
          payment_due_date: deal.payment_due_date || "--",
          user_id: "--", // 기본 값
          user_name: "--", // 기본 값
          user_interest: "--", // 기본 값,
          user_final_allocation: "--",
          user_payment_amount: "--",
          total_interest: deal.total_interest || 0, // total_interest 값이 없으면 0으로 설정
          payment_status: "--",
          payment_link: "--",
        };
      }

      // dealInterests가 있는 경우 각 userInterest를 매핑하여 반환
      return deal.dealInterests.map((userInterest) => ({
        deal_id: deal.deal_id,
        deal_name: deal.deal_name,
        deal_status: deal.deal_status,
        final_cap: deal.final_cap,
        payment_due_date: deal.payment_due_date,
        user_id: userInterest.user_id || "--", // user_id가 없을 경우 '=='로 설정
        user_name: userInterest.user ? userInterest.user.user_name : "--", // user_name이 없으면 '=='
        user_interest: userInterest.user_interest || "--", // user_interest가 없으면 '=='
        user_final_allocation: userInterest.user_final_alloc || "--",
        user_payment_amount: userInterest.payment_amount || "--",
        total_interest: deal.total_interest || 0, // total_interest 값이 없으면 0으로 설정
        payment_status: userInterest.payment_status || "--",
        payment_link: userInterest.payment_link || "--",
      }));
    });

    // 중첩 배열을 평탄화(flat)하여 하나의 배열로 만듦
    const flatData = formattedData.flat();

    // 변환된 데이터를 클라이언트로 전송
    res.status(200).json(flatData);
  } catch (error) {
    console.error("Error fetching deal interests:", error);
    res.status(500).json({
      message: "Failed to fetch deal interests",
      error: error.message,
    });
  }
};

exports.updateDealStatus = () => {
  cron.schedule("1 0 * * *", async () => {
    try {
      console.log("Status Update Start...");
      const currentDate = new Date(); // 현재 날짜를 가져옵니다.

      // end_date가 오늘 날짜 이전이면서 상태가 'RAISING'인 딜을 찾습니다.
      const expiredDeals = await DealInfo.findAll({
        where: {
          end_date: {
            [Op.lte]: currentDate, // 오늘 날짜 이전의 end_date
          },
          deal_status: "RAISING", // 상태가 'RAISING'인 경우만
        },
      });

      if (expiredDeals.length > 0) {
        // 만료된 딜들의 상태를 'PAYMENT_PENDING'으로 업데이트
        await DealInfo.update(
          { deal_status: "PAYMENT_PENDING" },
          {
            where: {
              end_date: {
                [Op.lte]: currentDate,
              },
              deal_status: "RAISING",
            },
          }
        );

        console.log(
          `${expiredDeals.length} deal(s) updated to PAYMENT_PENDING status.`
        );
      } else {
        console.log("No deals to update.");
      }
    } catch (error) {
      console.error("Error updating deal status:", error);
    }
  });
};

// HTML 템플릿 파일 경로
const emailTemplatePath = path.join(
  __dirname,
  "../../../../utils/templates/userInterestTemplate.html"
);

console.log("Email Template Path:", emailTemplatePath);

// Nodemailer 설정 (SMTP 설정)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 이메일 전송 함수
const sendDealEmail = async (recipient, dealData) => {
  // HTML 템플릿 파일 읽기
  let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

  // 템플릿 내의 플레이스홀더를 동적 데이터로 교체
  emailTemplate = emailTemplate
    .replace("@@userName", dealData.user_name)
    .replace("@@dealName", dealData.deal_name)
    .replace("@@finalAllocation", dealData.final_allocation)
    .replace("@@paymentDueDate", dealData.payment_due_date)
    .replace(
      "@@googleFormLink",
      dealData.google_form_link || "링크가 제공되지 않았습니다."
    );

  // 이메일 옵션 설정
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: recipient,
    subject: `[Komm DAO] ${dealData.deal_name} 프로젝트 납입 안내`,
    html: emailTemplate, // HTML 템플릿을 본문으로 설정
  };

  // 이메일 전송
  await transporter.sendMail(mailOptions);
};
exports.sendEmailNotifications = async (req, res) => {
  const { deals } = req.body;
  console.log(deals);
  try {
    const emailPromises = deals.map(async (deal) => {
      const { deal_name, user_name, final_allocation, payment_due_date } = deal;
      console.log("111", user_name);
      // 유저 이름을 기준으로 이메일 주소를 조회
      const userInfo = await UserInfo.findOne({ where: { user_name } });
      if (!userInfo) {
        console.error(`User with name ${user_name} not found.`);
        return; // 이메일 정보가 없는 경우, 해당 유저를 건너뜀
      }

      const user_email = userInfo.email_addr;
      console.log(`Sending email to: ${user_email}`);

      // 이메일 전송
      await sendDealEmail(user_email, {
        user_name,
        deal_name,
        final_allocation,
        payment_due_date,
        google_form_link: req.body.channel || "링크가 제공되지 않았습니다.",
      });
    });

    // 모든 이메일 전송이 완료될 때까지 기다림
    await Promise.all(emailPromises);

    res
      .status(200)
      .send({ success: true, message: "Emails sent successfully." });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send({ success: false, message: "Failed to send emails." });
  }
};

exports.updatePaymentPeriod = async (req, res) => {
  const {
    deal_id,
    user_id,
    user_name,
    deal_status,
    final_cap,
    user_final_allocation,
    payment_due_date,
  } = req.body;
  console.log(user_final_allocation);
  console.log(payment_due_date);
  const formattedDate = moment(payment_due_date, "YYYY. MM. DD.").format(
    "YYYY-MM-DD"
  );

  try {
    // 1. DealInfo 테이블 업데이트

    const dealInfoUpdateResult = await DealInfo.update(
      {
        deal_status: "PAYMENT_PERIOD", // 상태 변경 (Payment_Period)
        final_cap, // Final Cap 값 업데이트
        payment_due_date: formattedDate, // Payment Due Date 값 업데이트
      },
      {
        where: { deal_id }, // deal_id 기준 업데이트
      }
    );

    console.log("DealInfo Updated:", dealInfoUpdateResult);

    // 2. UserDealInterest 테이블 업데이트 (각 사용자별로 업데이트)
    const userDealInterestUpdateResult = await UserDealInterest.update(
      {
        user_final_alloc: user_final_allocation, // 사용자 최종 할당량 업데이트
        payment_status: "ING", // 초기 상태를 Ing로 설정
      },
      {
        where: {
          deal_id, // deal_id와
          user_id, // user_id를 기준으로 업데이트
        },
      }
    );

    console.log("UserDealInterest Updated:", userDealInterestUpdateResult);

    res.status(200).send({
      success: true,
      message: "Deal and user interest status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating payment period:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update payment period.",
    });
  }
};

exports.updatePaymentVerifyStatus = () => {
  // 매일 자정에 실행되도록 스케줄링 (0시 1분에 실행)
  cron.schedule("1 0 * * *", async () => {
    try {
      console.log("Payment Verify Status Update Start...");
      const currentDate = moment().format("YYYY-MM-DD"); // 현재 날짜를 "YYYY-MM-DD" 형식으로 가져오기

      // payment_due_date가 오늘 날짜 이전이면서 상태가 'PAYMENT_PERIOD'인 딜 찾기
      const dueDeals = await DealInfo.findAll({
        where: {
          payment_due_date: {
            [Op.lte]: currentDate, // 오늘 날짜 이전 또는 같은 payment_due_date
          },
          deal_status: "PAYMENT_PERIOD", // 상태가 'PAYMENT_PERIOD'인 경우만
        },
      });

      if (dueDeals.length > 0) {
        // 만료된 딜들의 상태를 'PAYMENT_VERIFY'로 업데이트
        await DealInfo.update(
          { deal_status: "PAYMENT_VERIFY" },
          {
            where: {
              payment_due_date: {
                [Op.lte]: currentDate, // 오늘 날짜 이전 또는 같은 payment_due_date
              },
              deal_status: "PAYMENT_PERIOD", // 기존 상태가 PAYMENT_PERIOD인 경우만
            },
          }
        );

        console.log(
          `${dueDeals.length} deal(s) updated to PAYMENT_VERIFY status.`
        );
      } else {
        console.log("No deals to update to PAYMENT_VERIFY.");
      }
    } catch (error) {
      console.error("Error updating deal status to PAYMENT_VERIFY:", error);
    }
  });
};

// payment_amount와 user_final_alloc이 동일할 경우 상태를 COMPLETED로 변경하는 함수
exports.updatePaymentStatus = () => {
  cron.schedule("1 0 * * *", async () => {
    try {
      console.log("Payment Status Update Start...");

      // 1. payment_status가 'ING' 상태인 사용자 데이터만 필터링
      const ongoingDeals = await UserDealInterest.findAll({
        where: {
          payment_status: "ING", // 현재 상태가 ING인 경우만
        },
      });

      if (ongoingDeals.length > 0) {
        // 2. 각 사용자의 payment_amount와 user_final_alloc 값을 비교하여 상태 업데이트
        for (const deal of ongoingDeals) {
          if (deal.payment_amount === deal.user_final_alloc) {
            // 조건이 만족되면 해당 사용자의 payment_status를 COMPLETED로 업데이트
            await UserDealInterest.update(
              { payment_status: "COMPLETED" },
              {
                where: {
                  deal_id: deal.deal_id,
                  user_id: deal.user_id,
                  payment_status: "ING", // 기존 상태가 ING인 경우만
                },
              }
            );
            console.log(
              `User ${deal.user_id} in deal ${deal.deal_id} updated to COMPLETED status.`
            );
          }
        }

        console.log("Payment status update completed.");
      } else {
        console.log("No deals with status 'ING' found.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  });
};

// Payment Verify를 처리하고 deal_status를 'CLOSED'로 변경하는 함수
exports.verifyPaymentStatus = async (req, res) => {
  try {
    const { deal_id } = req.body; // 프론트에서 받은 deal_id를 가져옴

    // 해당 딜의 상태를 'CLOSED'로 변경
    const updatedDeal = await DealInfo.update(
      { deal_status: "PAYMENT_COMPLETED" },
      {
        where: {
          deal_id: deal_id, // 요청 받은 deal_id에 해당하는 딜만 업데이트
          deal_status: "PAYMENT_VERIFY", // 상태가 PAYMENT_VERIFY인 경우만 변경
        },
      }
    );

    if (updatedDeal[0] > 0) {
      // 상태가 성공적으로 업데이트된 경우
      res.status(200).json({
        message: "Deal status successfully updated to PAYMENT_COMPLETED.",
      });
    } else {
      // 해당 딜이 없거나 상태가 이미 다른 값인 경우
      res.status(404).json({
        message: "Deal not found or status already updated.",
      });
    }
  } catch (error) {
    console.error("Error updating deal status to PAYMENT_COMPLETED:", error);
    res.status(500).json({
      message: "Internal server error while updating deal status.",
    });
  }
};

// Payment Verify를 처리하고 deal_status를 'CLOSED'로 변경하는 함수
exports.updateCompleteStatus = async (req, res) => {
  try {
    const { deal_id } = req.body; // 프론트에서 받은 deal_id를 가져옴

    // 해당 딜의 상태를 'CLOSED'로 변경
    const updatedDeal = await DealInfo.update(
      { deal_status: "CLOSED" },
      {
        where: {
          deal_id: deal_id, // 요청 받은 deal_id에 해당하는 딜만 업데이트
          deal_status: "PAYMENT_COMPLETED", // 상태가 PAYMENT_VERIFY인 경우만 변경
        },
      }
    );

    if (updatedDeal[0] > 0) {
      // 상태가 성공적으로 업데이트된 경우
      res.status(200).json({
        message: "Deal status successfully updated to CLOSED.",
      });
    } else {
      // 해당 딜이 없거나 상태가 이미 다른 값인 경우
      res.status(404).json({
        message: "Deal not found or status already updated.",
      });
    }
  } catch (error) {
    console.error("Error updating deal status to CLOSED:", error);
    res.status(500).json({
      message: "Internal server error while updating deal status.",
    });
  }
};
