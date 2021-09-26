import React, { useEffect, useCallback, useState, useRef } from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { Input } from "react-chat-elements";
import { MessageBox } from "react-chat-elements";
import RecipientInfo from "./RecipientInfo";
import Icon from "../../Icon/Icon";
import { uploadNewFile } from "../../../redux/media/mediaActions";
import FormInput from "../../FormInput/FormInput";
import Button from "../../Button/Button";
import Card from "../../Card/Card";

const Messages = ({ data, recipient, onMessageSent, startUploadFile }) => {
  const [messageText, setMessageText] = useState("");
  const fileInputRef = useRef();

  const [file, setFile] = useState(null);
  const [pricePanelVisible, setPricePanelVisible] = useState(false);
  const [messagePrice, setMessagePrice] = useState(0);
  const [messageSecureUrl, setMessageSecureUrl] = useState(null);

  const onFileSelected = (file) => {
    setFile(file);
    fileInputRef.current.value = "";
    //renderPreviews();
    console.log("file selected");
    console.log(file);
    let formData = new FormData();
    formData.append("medias", file);
    startUploadFile(formData, (secure_url) => {
      console.log("Image uploaded successfully: " + secure_url);
      setMessageSecureUrl(secure_url);
      onMessageReady(null, false);
    });
  };

  const onMessageReady = (e, priceSet) => {
    let payload = {
      conversationId: "",
      recipient: recipient.username,
      message: {
        type: "text",
        text: messageText,
      },
      isPaid: false,
      messagePrice: 0,
    };
    if (messageSecureUrl) {
      payload.message.type = "file";
      payload.message.secure_url = messageSecureUrl;
      if (priceSet) {
        if (messagePrice > 0) {
          payload.isPaid = true;
          payload.messagePrice = messagePrice;
          if (onMessageSent) onMessageSent(payload);
          setPricePanelVisible(false);
        }
      } else {
        setPricePanelVisible(true);
      }
    } else {
      if (onMessageSent) onMessageSent(payload);
      if (inputRef) inputRef.clear();
    }
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onMessageReady();
    }
  };

  const onUploadFileClicked = (e) => {
    fileInputRef.current.click();
  };

  const onMessageTextChanged = (e) => {
    setMessageText(e.target.value);
  };

  const renderMessageBox = (message) => {
    if (message.type === "text") {
      return (
        <MessageBox
          position={message.incoming ? "left" : "right"}
          type={message.type}
          text={message.text}
          date={new Date(message.sentAt)}
        />
      );
    } else if (message.type === "photo") {
      if (message.isPaid && message.userPaid) {
        return (
          <MessageBox
            position={message.incoming ? "left" : "right"}
            type={message.type}
            text={message.text}
            date={new Date(message.sentAt)}
            data={{
              uri: message.secure_url,
              status: {
                click: true,
                loading: 0,
              },
              width: 300,
              height: 300,
            }}
          />
        );
      }
      else {
        return (
          <MessageBox
            position={message.incoming ? "left" : "right"}
            type={message.type}
            text={message.text}
            date={new Date(message.sentAt)}
            data={{
              uri: message.secure_url,
              status: {
                click: true,
                loading: 0,
              },
              width: 300,
              height: 300,
            }}
          />
        );
      }
    } else if (message.type === "video") {
      return (
        <MessageBox
          position={message.incoming ? "left" : "right"}
          type={message.type}
          text={message.text}
          date={new Date(message.sentAt)}
          data={{
            uri: message.secure_url,
            status: {
              click: true,
              loading: 0,
              download: true,
            },
            width: 300,
            height: 300,
          }}
        />
      );
    } else {
      return null;
    }
  };

  const renderPaidMessagePanel = () => {
    if (!pricePanelVisible) return null;
    return (
      <Card
        className="settings-card"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <input
          id="price"
          placeholder="Enter message price..."
          type={"tel"}
          style={{ width: 200 }}
          defaultValue={messagePrice}
          onKeyPress={preventNonNumericalInput}
          onChange={(e) =>
            onMessagePriceChanged && onMessagePriceChanged(e.target.value)
          }
        />
        <Button
          bold
          blue
          style={{
            fontSize: "1.5rem",
            float: "right",
            width: 150,
            backgroundColor: "#0095f6",
          }}
          onClick={(e) => onMessageReady(e, true)}
        >
          Send
        </Button>
      </Card>
    );
  };
  let inputRef = React.createRef();

  function preventNonNumericalInput(e) {
    console.log("onkeypress");
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (charStr == ".") {
      return;
    }
    if (isNaN(parseInt(charStr))) {
      e.preventDefault();
    }
  }

  const onMessagePriceChanged = (value) => {
    console.log("message price changed");
    if (!value) setMessagePrice(0);
    else {
      try {
        setMessagePrice(parseFloat(value));
      } catch (e) {
        console.error("error occurred while parsing message price " + e);
      }
    }
  };

  return (
    <div class="messages">
      <div class="messages" style={{ marginBottom: 30 }}>
        {data.map((message) => {
          return renderMessageBox(message);
        })}
      </div>
      <div class="message-input">
        <div class="wrap">
          {renderPaidMessagePanel()}
          <Input
            ref={(el) => (inputRef = el)}
            placeholder="Type here..."
            multiline={true}
            onKeyPress={onKeyPress}
            onChange={onMessageTextChanged}
            rightButtons={
              <div>
                <button onClick={onMessageReady}>
                  <Icon icon={"paper-plane-outline"} />
                </button>
                <button onClick={onUploadFileClicked}>
                  <Icon icon={"images-outline"} />
                </button>
              </div>
            }
          />
          <input
            style={{ display: "none" }}
            onChange={(e) => onFileSelected(e.target.files[0])}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startUploadFile: (formData, onImageUploaded) =>
    dispatch(uploadNewFile(formData, onImageUploaded)),
});
export default connect(null, mapDispatchToProps)(Messages);
