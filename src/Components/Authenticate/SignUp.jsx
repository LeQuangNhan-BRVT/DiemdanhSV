import React, { useState } from "react";
export default (props) => {
  const [input1, onChangeInput1] = useState("");
  const [input2, onChangeInput2] = useState("");

  const handleSignup = () => {
    // Add your login logic here
    alert("press");
  };
  return (
    <div
      style={{
        backgroundImage:
          "url(https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/275zl0or.png)",
        display: "flex",
        padding: 52,
      }}
    >
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 47,
          marginBottom: 75,
          marginLeft: 500,
          marginRight: 114,
          position: "relative",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "#CFB7B7",
            borderRadius: 18,
            border: `1px solid #000000`,
            paddingTop: 23,
            paddingBottom: 55,
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                color: "#050317",
                fontSize: 40,
                fontWeight: "bold",
              }}
            >
              {"Đăng kí"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#D9D9D9",
              borderRadius: 22,
              border: `1px solid #000000`,
              paddingTop: 15,
              paddingBottom: 15,
              paddingLeft: 5,
              paddingRight: 5,
              marginBottom: 23,
              marginLeft: 23,
            }}
          >
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/tn42fves.png"
              }
              style={{
                width: 29,
                height: 26,
                marginRight: 3,
                objectFit: "fill",
              }}
            />
            <input
              placeholder={"Email"}
              value={input1}
              onChange={(event) => onChangeInput1(event.target.value)}
              style={{
                color: "#9E8E8E",
                fontSize: 24,
                width: 368,
                background: "none",
                border: "none",
              }}
            />
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/xl8mryht.png"
              }
              style={{
                width: 26,
                height: 26,
                objectFit: "fill",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#D9D9D9",
              borderRadius: 22,
              border: `1px solid #000000`,
              paddingTop: 15,
              paddingBottom: 15,
              paddingLeft: 12,
              paddingRight: 12,
              marginBottom: 20,
              marginLeft: 23,
            }}
          >
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/vlr6q63d.png"
              }
              style={{
                width: 29,
                height: 26,
                objectFit: "fill",
              }}
            />
            <input
              placeholder={"Password"}
              value={input2}
              onChange={(event) => onChangeInput2(event.target.value)}
              style={{
                color: "#9E8E8E",
                fontSize: 24,
                width: 364,
                background: "none",
                border: "none",
              }}
            />
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/bwng0ekb.png"
              }
              style={{
                width: 26,
                height: 23,
                objectFit: "fill",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#D9D9D9",
              borderRadius: 22,
              border: `1px solid #000000`,
              padding: 13,
              marginBottom: 35,
              marginLeft: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginRight: 205,
              }}
            >
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/in93wy46.png"
                }
                style={{
                  width: 29,
                  height: 26,
                  objectFit: "fill",
                }}
              />
              <input
                style={{
                  color: "#9E8E8E",
                  fontSize: 24,
                  marginLeft: 28,
                }}
              >
                {"Corfirm Password"}
              </input>
            </div>
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/a17wxsag.png"
              }
              style={{
                width: 26,
                height: 23,
                objectFit: "fill",
              }}
            />
          </div>
          <button
            onClick={handleSignup}
            style={{
              color: "#BD4D4D",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 1,
              marginLeft: 158,
              background: "#D9D9D9",
              borderRadius: 22,
              border: `1px solid #000000`,
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 48,
              paddingRight: 48,
            }}
          >
            <span>Dang ky</span>
          </button>
          <span
            style={{
              color: "#C8070A",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 124,
              marginRight: 124,
            }}
          >
            {"Đã có tài khoản! Đăng nhập."}
          </span>
        </div>
        <img
          src={
            "https://storage.googleapis.com/tagjs-prod.appspot.com/E5M6CgUoAK/jkykutge.png"
          }
          style={{
            position: "absolute",
            bottom: -34,
            left: -161,
            width: 197,
            height: 200,
            objectFit: "fill",
          }}
        />
      </div>
    </div>
  );
};
