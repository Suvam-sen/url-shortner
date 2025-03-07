import { URL } from "../models/Url.model.js";
import { nanoid } from "nanoid";

const generateShortId = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: "Url is required" });
  }

  const shortId = nanoid(6); // Generate a short ID

  try {
    const newUrl = await URL.create({
      shortId,
      redirectUrl: url,
      clicks: 0,
    });

    return res.status(200).json({
      success: true,
      data: newUrl,
      message: "Success",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

const redirectUrl = async (req, res) => {
  const { shortId } = req.params;
  if (!shortId) {
    return res.status(400).json({ success: false, message: "Short ID is required" });
  }

  try {
    const url = await URL.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    return res.redirect(301, url.redirectUrl);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

const getUrlStats = async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlData = await URL.findOne({ shortId });

    if (!urlData) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }

    return res.status(200).json({ success: true, data: { clicks: urlData.clicks } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export { generateShortId, redirectUrl, getUrlStats };
