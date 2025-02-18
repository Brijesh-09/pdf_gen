const convertor = require("../convertor/convertor");
const newConvertor = require("../convertor/newConvertor");
const knex = require("../config/database/connection");
const sendEmail = require("../convertor/emailService");

exports.create = async (req, res) => {
  try {
    const convertorResult = await convertor(req.body, req.body.emailAddress);

    const bodyData = req.body;
    bodyData.childList = JSON.stringify(req.body.childList);
    bodyData.nameList = JSON.stringify(req.body.nameList);
    delete bodyData.allNames;
    delete bodyData.nameVariations;
    if (convertorResult.result) {
      const result = await knex("user_info").insert({
        ...bodyData,
        urls: JSON.stringify(convertorResult.url)
      });

      if (!result) {
        return res.status(403).json({
          success: false,
          massage: "something went wrong"
        });
      } else {
        await sendEmail(convertorResult.zip, "Doc.zip", req.body.emailAddress);
        res.status(200).json({
          success: true,
          massage: "PDF sent to user email"
        });
      }
    } else {
      res.status(403).json({
        success: false,
        massage: "Failed to send PDF"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};
//download_controller
exports.newCreate = async (req, res) => {
  try {
    const convertorResult = await newConvertor(req.body, req.body.emailAddress);

    const bodyData = req.body;
    bodyData.childList = JSON.stringify(req.body.childList);
    bodyData.nameList = JSON.stringify(req.body.nameList);
    delete bodyData.allNames;
    delete bodyData.nameVariations;
    if (convertorResult.result) {
      const result = await knex("user_info").insert({
        ...bodyData,
        urls: JSON.stringify(convertorResult.url)
      });

      if (!result) {
        return res.status(403).json({
          success: false,
          message: "something went wrong"
        });
      } else {
        await sendEmail(convertorResult.zip, "Doc.zip", req.body.emailAddress);
        res.status(200).json({
          success: true,
          message: "PDF sent to user email"
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "Failed to send PDF"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const data = await knex("user_info").where({ id }).first();
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Record not Found"
      });
    }
    const convertorResult = await convertor(
      updatedData,
      updatedData.emailAddress
    );

    if (convertorResult.result) {
      delete updatedData.allNames;
      delete updatedData.nameVariations;
      const result = await knex("user_info")
        .where({ id })
        .update({
          ...updatedData,
          childList: JSON.stringify(updatedData.childList),
          nameList: JSON.stringify(updatedData.nameList),
          urls: JSON.stringify(convertorResult.url)
        });

      if (result) {
        await sendEmail(
          convertorResult.zip,
          "Doc.zip",
          updatedData.emailAddress
        );
        return res.status(200).json({
          success: true,
          message: "Record updated and PDF sent to user email"
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Record failed to updated but send PDF"
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "failed to send PDF"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    const offset = (page - 1) * limit;

    const list = await knex("user_info")
      .select(
        "id",
        "firstName",
        "middleName",
        "lastName",
        "emailAddress",
        "phoneNumber",
        "city",
        "state",
        "zipCode",
        "urls",
        "created_at",
        "updated_at"
      )
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    const totalUsers = await knex("user_info").count("id as count").first();
    const totalCount = totalUsers.count;

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: list,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};

exports.one = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await knex("user_info").select().where("id", id).first();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};
