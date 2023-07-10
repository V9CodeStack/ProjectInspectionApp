import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import ReactPDF, { Font } from "@react-pdf/renderer";
// Import the font files
import RobotoRegular from "../../fonts/Roboto-Regular.ttf";
import RobotoBold from "../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../fonts/Roboto-Italic.ttf";
import RobotoBoldItalic from "../../fonts/Roboto-LightItalic.ttf";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// Register the font
Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoRegular, fontWeight: "normal" },
    { src: RobotoBold, fontWeight: "bold" },
    { src: RobotoItalic, fontStyle: "italic" },
    { src: RobotoBoldItalic, fontWeight: "bold", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    fontWeight: "normal",
    opacity: 0.8,
  },
  commentListItem: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "flex-start",
    fontWeight: "normal",
    opacity: 0.8,
  },
  bulletPoint: {
    fontSize: 12,
    marginTop: 1,
  },
  feedbackMessage: {
    flex: 1,
    marginLeft: 5,
    fontWeight: "normal",
    opacity: 0.9,
  },
  feedbackContainer: {
    marginLeft: 10,
  },
  managerFeedback: {
    marginTop: 3,
    fontSize: 12,
    textDecoration: "underline",
  },
  managerContainer: {
    marginLeft: 35,
  },
  divider: {
    borderBottom: "1px solid lightgray",
    marginBottom: 10,
    marginTop: 15,
  },
});

const BulletPoint = () => <Text style={styles.bulletPoint}>•</Text>;

const DownloadPdf = () => {
  const [loderFlag, setLoaderFlag] = useState(false);

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Oval" color="white" height="15" width="15" />
    </div>
  );

  const downloadAsPDF = async () => {
    const groupNameCookie = Cookies.get("group_name");
    const groupIdCookie = Cookies.get("manager_group_id");
    if (groupIdCookie !== undefined) {
      setLoaderFlag(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupIdCookie}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok === true) {
        const finalData = data.reduce((acc, feedback) => {
          const { feedbackMessage, comments, feedbackType } = feedback;
          if (feedbackMessage.trim() === "") return acc;
          if (!acc[feedbackType]) {
            acc[feedbackType] = [];
          }
          const feedbackContent = { feedbackMessage, comments: [] };
          if (comments.length > 0) {
            feedbackContent.comments = comments.map(
              (comment) => comment.commentMessage
            );
          }
          acc[feedbackType].push(feedbackContent);
          return acc;
        }, {});

        const pdfDocument = (
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.heading}>{groupNameCookie}</Text>
              <Text style={{ textAlign: "right", fontSize: 10 }}>
                Date: {new Date().toLocaleDateString()}
              </Text>
              {Object.entries(finalData).map(
                ([feedbackType, feedbacks], index) => (
                  <View key={feedbackType}>
                    <Text style={styles.subheading}>{feedbackType}:</Text>
                    {feedbacks.map((feedback, feedbackIndex) => (
                      <View
                        key={feedbackIndex}
                        style={styles.feedbackContainer}
                      >
                        <View style={styles.listItem}>
                          <BulletPoint />
                          <Text style={styles.feedbackMessage}>
                            {feedback.feedbackMessage}
                          </Text>
                        </View>
                        {feedback.comments && feedback.comments.length > 0 && (
                          <View style={styles.managerContainer}>
                            <Text style={styles.managerFeedback}>
                              Manager Feedback:
                            </Text>
                            {feedback.comments.map((comment, commentIndex) => (
                              <View
                                key={commentIndex}
                                style={styles.commentListItem}
                              >
                                <Text style={styles.feedbackMessage}>
                                  {comment}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                    {index < Object.entries(finalData).length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                )
              )}
            </Page>
          </Document>
        );
        setLoaderFlag(false);
        const asPdfBlob = await pdf(pdfDocument).toBlob();
        const fileName = `${groupNameCookie} ${new Date().toLocaleDateString()}.pdf`;
        saveAs(asPdfBlob, fileName);
      }
    }
  };

  return (
    <div>
      <button
        style={{ width: "120px", height: "31px" }}
        type="button"
        className="button"
        onClick={downloadAsPDF}
      >
        {loderFlag ? renderLoadingView() : "Download PDF"}
      </button>
    </div>
  );
};

export default DownloadPdf;
