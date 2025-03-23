import React, { useState } from "react";
import "../Authenticate/Teach.css";

export default (props) => {
  const [input1, onChangeInput1] = useState("");
  const [input2, onChangeInput2] = useState("");
  
  return (
    <div className="contain">
      <div
        className="view"
        style={{
          backgroundImage:
            "url(https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/275zl0or.png)",
        }}
      >
        <div className="scroll-view">
          <div className="column">
            <span className="text">{"Teacher Login"}</span>
            <div className="row-view">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/b8dghibr.png"
                }
                className="image"
              />
              <input
                placeholder={"Email"}
                value={input1}
                onChange={(event) => onChangeInput1(event.target.value)}
                className="input"
              />
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/ciarjd6u.png"
                }
                className="image2"
              />
            </div>
            <div className="row-view2">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/pkwy3bfh.png"
                }
                className="image"
              />
              <input
                type="password"
                placeholder={"Password"}
                value={input2}
                onChange={(event) => onChangeInput2(event.target.value)}
                className="input2"
              />
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/889e81ut.png"
                }
                className="image3"
              />
            </div>
            <span className="text3">{"Forgot password?"}</span>
            <div className="view2">
              <button className="button" onClick={() => alert("Pressed!")}>
                <span className="text2">{"Login"}</span>
              </button>
            </div>
          </div>
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/m0wkg73u.png"
            }
            className="absolute-image"
          />
        </div>
      </div>
    </div>
  );
};
