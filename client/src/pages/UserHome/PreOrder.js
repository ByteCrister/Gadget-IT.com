import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import styles from "../../styles/HomePageStyles/PreOrderPage.module.css";
import { useData } from "../../context/useData";

const PreOrder = ({ setUserEntryState }) => {
  const { dataState, dispatch } = useContext(useData);
  const location = useLocation();
  const navigate = useNavigate();
  const [ButtonState, setButtonState] = useState("Submit");
  const [PreOrderState, setPreOrderState] = useState({
    product_name: "",
    product_image: "",
    user_name: "",
    phone_number: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch({
      type: "set_path_setting",
      payload: {
        prevPath: dataState.pathSettings.currPath,
        currPath: location.pathname,
      },
    });
    dispatch({ type: "toggle_isServerIssue", payload: false });
  }, [dispatch, location.pathname]);

  const handleChange = useCallback((e) => {
    setPreOrderState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }, []);


  const handleImageChange = useCallback((e) => {
    const { id, type, files } = e.target;

    if (type === "file") {
      const file = files[0];

      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        alert("Please upload a valid image file.");
        return null;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64WithMimeType = reader.result;

        // *Check if the file size exceeds 50KB
        if (base64WithMimeType.length <= 50 * 1024) {
          // *If file size is under 50KB, save it directly
          setPreOrderState((prevState) => ({
            ...prevState,
            [id]: base64WithMimeType,
          }));
          return;
        }

        const img = new Image();
        img.src = base64WithMimeType;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const mimeType = file.type;

          // *Define a compression function
          const compressImage = (canvas, mimeType, quality) => {
            return canvas.toDataURL(mimeType, quality);
          };

          // *Start with 90% quality and reduce if needed
          let quality = 0.9;
          let compressedBase64 = compressImage(canvas, mimeType, quality);

          // *Reduce size iteratively until it's under 50KB
          while (compressedBase64.length > 50 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compressedBase64 = compressImage(canvas, mimeType, quality);
          }

          // *Update state with the compressed image
          setPreOrderState((prevState) => ({
            ...prevState,
            [id]: compressedBase64,
          }));
        };
      };

      reader.readAsDataURL(file);
    }
  }, []);



  const handlePreOrderSubmit = async (e) => {
    e.preventDefault();
    if (dataState.isUserLoggedIn) {
      setButtonState(
        <AiOutlineLoading3Quarters className={styles.LoadingBtnIcon} />
      );
      try {
        await axios.post("http://localhost:7000/pre-order", PreOrderState, {
          headers: {
            Authorization: dataState.token,
          },
        });

        setButtonState("Done✔✔");
        setTimeout(() => {
          setButtonState("Submit");
        }, 2000);
        setTimeout(() => {
          navigate(dataState.pathSettings.prevPath);
          window.scrollTo(0, 0);
        }, 3000);
      } catch (error) {
        window.localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
        console.log(error);
      }
    } else {
      setUserEntryState(1);
    }
  };

  return (
    <section className={styles["main-pre-order-outer-section"]}>
      <form
        className={styles["pre-order-form"]}
        onSubmit={handlePreOrderSubmit}
      >
        <div>
          <span className={styles["pre-order-heading-1"]}>
            Looking For Something Different ??
          </span>
          <span className={styles["pre-order-heading-2"]}>
            Put Your Information in The Box...
          </span>
        </div>
        <div>
          <label htmlFor="Product Information">Product Information</label>
          <input
            type="text"
            id="product_name"
            value={PreOrderState.product_name}
            onChange={handleChange}
            placeholder="Enter Product Name/URL"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="Insert Image">Insert Image</label>
          <input
            type="file"
            id="product_image"
            onChange={handleImageChange}
            placeholder="Add Image"
          ></input>
        </div>
        <div>
          <label htmlFor="Name">Name</label>
          <input
            type="text"
            id="user_name"
            value={PreOrderState.user_name}
            onChange={handleChange}
            placeholder="Enter Name"
            required
          ></input>
        </div>
        <section>
          <div>
            <label htmlFor="Phone">Phone</label>
            <input
              type="tel"
              id="phone_number"
              value={PreOrderState.phone_number}
              onChange={handleChange}
              placeholder="Enter Phone no"
              required
            ></input>
          </div>
          <div>
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="email"
              value={PreOrderState.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              required
            ></input>
          </div>
        </section>
        <div>
          <label htmlFor="Address">Address</label>
          <textarea
            rows={5}
            cols={30}
            id="address"
            value={PreOrderState.address}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          {" "}
          <button type="submit">{ButtonState}</button>
        </div>
      </form>
    </section>
  );
};

export default PreOrder;
