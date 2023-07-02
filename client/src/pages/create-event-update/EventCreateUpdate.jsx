import { useEffect, useRef, useState } from "react";
import {
  useValidateDatetime,
  useValidateRegex,
} from "../../hooks/validateHooks";
import {
  createComment,
  deleteComment,
  getCommentByEventId,
} from "../../features/comment/commentSlice";
import { titleRegex, urlRegex } from "../../constants/regex";
import customFetch from "../../utils/axios.config";
import { Button, Input, Loading, Switch } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import covertDatetimeToISO from "../../utils/coverDatetimeToIso";
import provinces from "../../data/provinces.json";
import notify from "../../utils/notify.js";
import "./EventCreateUpdate.css";

const EventCreateUpdate = () => {
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    title: "",
    fee: "",
    quantityTicket: "",
    description: "",
    address: "",
    typeEvent: "offline",
    category: "",
    linkOnline: "",
    dateStart: "",
    dateEnd: "",
    dateRegisterEnd: "",
    timeStart: "",
    timeEnd: "",
    timeRegisterEnd: "",
  });
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [isImageEventLoaing, setIsImageEventLoaing] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [banner, setBanner] = useState();
  const [imageEvent, setImageEvent] = useState([]);
  const [isFree, setIsFree] = useState(false);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [event, setEvent] = useState({});
  const editorRef = useRef(null);

  useEffect(() => {
    customFetch
      .get("/category/all")
      .then((response) => {
        setCategoryList(response.data.data);
      })
      .catch((error) => {
        notify("Lỗi không lấy được danh sách danh mục");
      });

    if (searchParams.get("type") === "update") {
      customFetch
        .get(`/events/get/${searchParams.get("id")}`)
        .then((resp) => {
          if (!(resp.data[0].creator._id === userInfo._id)) {
            navigate("/");
          }
          setEvent(resp.data[0]);
        })
        .catch((error) => notify("Lỗi kết nối máy chủ", error));
    }
  }, []);

  useEffect(() => {
    let tiny;

    if (event?._id) {
      if (event.fee === 0) {
        setIsFree(true);
      }

      const timeBegin = new Date(event?.timeBegin);
      const timeEnd = new Date(event?.timeEnd);
      const timeEndSignup = new Date(event?.timeEndSignup);
      const date = (data) => {
        return `${data.getFullYear()}-${("0" + (data.getMonth() + 1)).slice(
          -2
        )}-${("0" + data.getDate()).slice(-2)}`;
      };
      const time = (data) => {
        return `${("0" + data.getHours()).slice(-2)}:${(
          "0" + data.getMinutes()
        ).slice(-2)}`;
      };

      setInputValue({
        title: event.title,
        fee: String(event.fee),
        quantityTicket: String(event.limitUser),
        typeEvent: event.isOnline ? "online" : "offline",
        category: event?.category.categoryName,
        address: event.location?.address,
        linkOnline: event.linkOnline,
        description: event.description,
        dateStart: date(timeBegin),
        timeStart: time(timeBegin),
        dateEnd: date(timeEnd),
        timeEnd: time(timeEnd),
        dateRegisterEnd: date(timeEndSignup),
        timeRegisterEnd: time(timeEndSignup),
      });
      setBanner(event.banner);
      setImageEvent(event.imageList);
      setCity(event.location?.province?.name);
      setDistrict(event.location?.district?.name);
      setWard(event.location?.ward?.name);
      tiny = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.setContent(event.description);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(tiny);
    };
  }, [event]);

  // RichTextEditor
  const log = () => {
    if (editorRef.current) {
      setInputValue({
        ...inputValue,
        description: editorRef.current.getContent(),
      });
    }
  };

  // Validate tiêu đề không có ký tự đặc biệ và số
  const titleHepler = useValidateRegex(
    inputValue.title,
    titleRegex,
    "Tiêu đề không được quá 150 ký tự"
  );

  // Validate giá vé chỉ được nhập số
  const feeHepler = useValidateRegex(
    inputValue.fee,
    /^[0-9]*$/,
    "Chỉ được phép nhập số"
  );

  // Validate số lượng người tham gia chỉ được nhập số
  const quantityTicketHepler = useValidateRegex(
    inputValue.quantityTicket,
    /^[0-9]*$/,
    "Chỉ được phép nhập số"
  );

  const urlHepler = useValidateRegex(
    inputValue.linkOnline,
    urlRegex,
    "Đường dẫn không đúng định dạng"
  );

  // Kiểm tra ngày bắt đầu sự kiện luôn luôn trước ngày kết thúc
  const checkDateStartEnd = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.dateStart,
    true,
    "Thời gian bắt đầu phải trước thời gian kết thúc"
  );

  // Kiểm tra ngày kết thúc sự kiện luôn luôn sau ngày bắt đầu
  const checkDateEndStart = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.dateStart,
    true,
    "Thời gian kết thúc phải sau thời gian bắt đầu"
  );

  // Kiểm tra giờ bắt đầu sự kiện luôn luôn trước giờ kết thúc
  const checkTimeStartEnd = useValidateDatetime(
    inputValue.timeEnd,
    inputValue.timeStart,
    false,
    "Thời gian bắt đầu phải trước thời gian kết thúc",
    inputValue.dateEnd,
    inputValue.dateStart
  );

  // Kiểm tra giờ kết thúc sự kiện luôn luôn sau giờ bắt đầu
  const checkTimeEndStart = useValidateDatetime(
    inputValue.timeEnd,
    inputValue.timeStart,
    false,
    "Thời gian kết thúc phải sau thời gian bắt đầu",
    inputValue.dateEnd,
    inputValue.dateStart
  );

  // Kiểm tra ngày ngưng đăng ký phải trước ngày bắt đầu
  const checkDateRegisterStart = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.dateRegisterEnd,
    true,
    "Thời gian dừng đăng ký phải trước thời gian bắt đầu"
  );

  // Kiểm tra giờ ngưng đăng ký phải trước giờ bắt đầu
  const checkTimeRegisterStart = useValidateDatetime(
    inputValue.timeEnd,
    inputValue.timeRegisterEnd,
    false,
    "Thời gian dừng đăng ký phải trước thời gian bắt đầu",
    inputValue.dateEnd,
    inputValue.dateRegisterEnd
  );

  const compare = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  // Xứ lý các trường nhập dữ liệu thay đổi lưu vào state
  const handleOnchange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  // Xử lý việc nhấn nút tạo
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isLocation = false;
    let feeTicket, location;
    let isLink = false;

    if (isFree) {
      inputValue.fee = 0;
      feeTicket = true;
    } else {
      feeTicket = inputValue.fee;
    }

    isLocation =
      inputValue.typeEvent === "online"
        ? true
        : inputValue.address && city && district && ward;

    isLink = inputValue.typeEvent === "online" ? urlHepler.isValid : true;

    if (inputValue.typeEvent === "offline") {
      const cityLocation = provinces.find((item) => item.name === city);
      const districtLocation = cityLocation.districts.find(
        (item) => item.name === district
      );
      const wardLocation = districtLocation.wards.find(
        (item) => item.name === ward
      );
      location = {
        address: inputValue.address,
        province: {
          name: cityLocation.name,
          code: cityLocation.code,
          division_type: cityLocation.division_type,
        },
        district: {
          name: districtLocation.name,
          code: districtLocation.code,
          division_type: districtLocation.division_type,
        },
        ward: {
          name: wardLocation.name,
          code: wardLocation.code,
          division_type: wardLocation.division_type,
        },
      };
    }

    const isSuccess =
      titleHepler.isValid &&
      feeTicket &&
      quantityTicketHepler.isValid &&
      checkDateEndStart.isValid &&
      checkDateRegisterStart.isValid &&
      inputValue.description &&
      inputValue.category &&
      banner &&
      imageEvent.length > 0 &&
      isLocation &&
      isLink;

    if (isSuccess) {
      const timeBegin = covertDatetimeToISO(
        inputValue.dateStart,
        inputValue.timeStart
      );
      const timeEndEvent = covertDatetimeToISO(
        inputValue.dateEnd,
        inputValue.timeEnd
      );
      const timeEndSignup = covertDatetimeToISO(
        inputValue.dateRegisterEnd,
        inputValue.timeRegisterEnd
      );

      const { _id } = categoryList?.find(
        (item) =>
          item.categoryName.toLowerCase() === inputValue.category.toLowerCase()
      );

      const data = {
        title: inputValue.title,
        description: inputValue.description,
        banner,
        imageList: imageEvent,
        category: _id,
        isOnline: inputValue.typeEvent === "online",
        fee: Number(inputValue.fee),
        location: inputValue.typeEvent === "offline" ? location : {},
        linkOnline:
          inputValue.typeEvent === "online" ? inputValue.linkOnline : "",
        timeBegin,
        timeEnd: timeEndEvent,
        timeEndSignup,
        limitUser: Number(inputValue.quantityTicket),
        reviews: [],
      };

      if (searchParams.get("type") === "update") {
        try {
          const response = await customFetch({
            method: "put",
            url: `/events/update/${searchParams.get("id")}`,
            data: JSON.stringify(data),
          });
          notify("Cập nhật thành công", "success");
          navigate(-1);
        } catch (error) {
          notify("Cập nhật thất bại", "error");
        }
      } else {
        try {
          const response = await customFetch({
            method: "post",
            url: "/events/create",
            data: JSON.stringify(data),
          });
          notify("Tạo sự kiện thành công", "success");

          // Reset value
          if (editorRef.current) {
            editorRef.current.setContent("");
          }
          setBanner("");
          setImageEvent([]);
          setCity("");
          setDistrict("");
          setWard("");
          setIsFree(false);
          setInputValue({
            title: "",
            fee: "",
            quantityTicket: "",
            description: "",
            address: "",
            typeEvent: "offline",
            linkOnline: "",
            category: "",
            dateStart: "",
            dateEnd: "",
            dateRegisterEnd: "",
            timeStart: "",
            timeEnd: "",
            timeRegisterEnd: "",
          });
        } catch (error) {
          notify("Tạo sự kiện thất bại", "error");
        }
      }
    }
  };

  const renderWard = () => {
    const wards = provinces
      .find((item) => item.name === city)
      .districts.find((item) => item.name === district)
      .wards.sort(compare);
    if (wards) {
      return wards.map((ward, index) => (
        <option key={index} value={ward.name}>
          {ward.name}
        </option>
      ));
    } else {
      setWard({ ...ward, name: "ward" });
    }
  };

  const apiUrlImg = async (data) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.length; i++) {
        formData.append("images", data[i]);
      }
      const resp = await customFetch.post("/upload?folder=event", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return resp.data.data;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="create-event">
      {searchParams.get("type") === "update" ? (
        <h2>Cập nhật sự kiện</h2>
      ) : (
        <h2>Tạo sự kiện mới</h2>
      )}
      <p
        style={{
          color: "gray",
          marginTop: "-10px",
          marginBottom: "30px",
          fontSize: "0.9rem",
        }}
      >
        {`Nhập đầy đủ thông tin trước khi nhấn ${
          searchParams.get("type") === "update" ? "cập nhật" : "tạo"
        } sự kiện.`}
      </p>
      <form className="create-event__form" onSubmit={handleSubmit}>
        <Input
          label="Tiêu đề"
          name="title"
          value={inputValue.title}
          status={titleHepler.color}
          color={titleHepler.color}
          helperText={titleHepler.text}
          helperColor={titleHepler.color}
          onChange={handleOnchange}
        />

        {/* Banner sự kiện */}
        <div className="create-event__image-input">
          <label>Banner</label>
          <input
            type="file"
            name="banner"
            className="file-input"
            accept="image/*"
            disabled={isBannerLoading}
            onChange={async (e) => {
              if (e.target.files.length > 0) {
                setIsBannerLoading(true);
                const url = await apiUrlImg(e.target.files);
                if (url.length > 0) {
                  setBanner(url[0]);
                  setIsBannerLoading(false);
                } else {
                  setIsBannerLoading(false);
                }
              }
            }}
          />
          {isBannerLoading && <Loading size="xs" />}
        </div>
        {banner && (
          <div className="create-envent__image-input-preview">
            <div>
              <img src={banner} alt="banner" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-trash"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#F31260", cursor: "pointer" }}
                onClick={() => {
                  setBanner("");
                }}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 7l16 0"></path>
                <path d="M10 11l0 6"></path>
                <path d="M14 11l0 6"></path>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
              </svg>
            </div>
          </div>
        )}

        {/* Hình ảnh sự kiện */}
        <div className="create-event__image-input">
          <label>Hình ảnh sự kiện</label>
          <input
            type="file"
            multiple
            name="banner"
            className="file-input"
            accept="image/*"
            disabled={isImageEventLoaing}
            onChange={async (e) => {
              if (e.target.files.length > 0) {
                setIsImageEventLoaing(true);
                const url = await apiUrlImg(e.target.files);
                if (url.length > 0) {
                  setImageEvent([...imageEvent, ...url]);
                  setIsImageEventLoaing(false);
                } else {
                  setIsImageEventLoaing(false);
                }
              }
            }}
          />
          {isImageEventLoaing && <Loading size="xs" />}
        </div>
        {imageEvent && (
          <div className="create-envent__image-input-preview create-envent__image-input-preview--display">
            {imageEvent?.map((img, index) => {
              return (
                <div key={index}>
                  <img src={img} alt="events" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-trash"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#F31260", cursor: "pointer" }}
                    onClick={() => {
                      imageEvent.splice(index, 1);
                      setImageEvent([...imageEvent]);
                    }}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 7l16 0"></path>
                    <path d="M10 11l0 6"></path>
                    <path d="M14 11l0 6"></path>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                  </svg>
                </div>
              );
            })}
          </div>
        )}

        <div className="create-event__buyfee">
          <span>Sự kiện miễn phí</span>
          <Switch
            size="xs"
            checked={isFree}
            onChange={() => setIsFree(!isFree)}
          />
        </div>

        <div className="create-event__type-fee">
          {isFree || (
            <Input
              label="Giá vé"
              name="fee"
              value={inputValue.fee}
              status={feeHepler.color}
              color={feeHepler.color}
              helperText={feeHepler.text}
              helperColor={feeHepler.color}
              contentRight="đ"
              style={{ textAlign: "right" }}
              onChange={handleOnchange}
            />
          )}

          <Input
            label="Số lượng vé"
            name="quantityTicket"
            value={inputValue.quantityTicket}
            status={quantityTicketHepler.color}
            color={quantityTicketHepler.color}
            helperText={quantityTicketHepler.text}
            helperColor={quantityTicketHepler.color}
            style={{ textAlign: "right" }}
            onChange={handleOnchange}
          />
          <div className="create-event__form--display">
            <span>Hình thức tổ chức</span>
            <select
              name="typeEvent"
              className="create-event__dropdown"
              value={inputValue.typeEvent}
              onChange={handleOnchange}
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="create-event__form--display">
            <span>Thể loại</span>
            <select
              name="category"
              className="create-event__dropdown"
              value={inputValue.category}
              onChange={handleOnchange}
            >
              <option value="">- Mời bạn chọn -</option>
              {categoryList?.map((item, index) => (
                <option value={item.categoryName} key={index}>
                  {item.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {inputValue.typeEvent === "offline" ? (
          <div className="create-event__address">
            <Input
              label="Địa điểm tổ chức"
              name="address"
              placeholder="Số nhà, tên đường"
              value={inputValue.address}
              onChange={handleOnchange}
            />
            <br />
            <select
              name="city"
              className="create-event__dropdown"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setDistrict("");
                setWard("");
              }}
            >
              <option value="">- Tỉnh/Thành phố -</option>
              {provinces.sort(compare).map((city, index) => (
                <option value={city.name} key={index}>
                  {city.name}
                </option>
              ))}
            </select>

            <select
              name="district"
              className="create-event__dropdown"
              value={district}
              disabled={city ? false : true}
              onChange={(e) => {
                setDistrict(e.target.value);
                setWard("");
              }}
            >
              <option value="">- Quận/Huyện -</option>
              {city &&
                provinces
                  .find((item) => item.name === city)
                  .districts.sort(compare)
                  .map((district, index) => (
                    <option key={index} value={district.name}>
                      {district.name}
                    </option>
                  ))}
            </select>

            <select
              name="ward"
              className="create-event__dropdown"
              value={ward}
              disabled={district ? false : true}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="" disabled={ward === "ward"}>
                - Phường/Xã -
              </option>
              {district && renderWard()}
            </select>
          </div>
        ) : (
          <Input
            label="Đường dẫn tham gia hình thức online"
            name="linkOnline"
            value={inputValue.linkOnline}
            status={urlHepler.color}
            color={urlHepler.color}
            helperText={urlHepler.text}
            helperColor={urlHepler.color}
            onChange={handleOnchange}
          />
        )}

        <p className="create-event__description">Mô tả sự kiện</p>
        <Editor
          apiKey="g5gefqfa9aseg305uetdofxk90iaoyhlyjrtwsewiaadf6sq"
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onKeyUp={log}
        />

        <section className="create-event__time--display">
          <div className="create-event__time">
            <p>Thời gian bắt đầu</p>
            <Input
              aria-label="ngày bắt đầu"
              type="date"
              name="dateStart"
              value={inputValue.dateStart}
              status={checkDateStartEnd.color}
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ bắt đầu"
              type="time"
              name="timeStart"
              value={inputValue.timeStart}
              status={checkTimeStartEnd.color}
              onChange={handleOnchange}
            />
            <p
              style={
                checkDateStartEnd.color || checkTimeStartEnd.color
                  ? { color: "#F31260" }
                  : { color: "transparent" }
              }
              className="error-message"
            >
              {checkDateStartEnd.text || checkTimeStartEnd.text}
            </p>
          </div>
          <div className="create-event__time">
            <p>Thời gian kết thúc</p>
            <Input
              aria-label="ngày kết thúc"
              type="date"
              name="dateEnd"
              value={inputValue.dateEnd}
              status={checkDateEndStart.color}
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ kết thúc"
              type="time"
              name="timeEnd"
              value={inputValue.timeEnd}
              status={checkTimeEndStart.color}
              onChange={handleOnchange}
            />
            <p
              style={
                checkDateEndStart.color || checkTimeEndStart.color
                  ? { color: "#F31260" }
                  : { color: "transparent" }
              }
              className="error-message"
            >
              {checkDateEndStart.text || checkTimeEndStart.text}
            </p>
          </div>
          <div className="create-event__time">
            <p>Thời gian ngưng nhận đăng ký</p>
            <Input
              aria-label="ngày kết thúc đăng ký"
              type="date"
              name="dateRegisterEnd"
              value={inputValue.dateRegisterEnd}
              status={checkDateRegisterStart.color}
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ kết thúc đăng ký"
              type="time"
              name="timeRegisterEnd"
              value={inputValue.timeRegisterEnd}
              status={checkTimeRegisterStart.color}
              onChange={handleOnchange}
            />
            <p
              style={
                checkDateRegisterStart.color || checkTimeRegisterStart.color
                  ? { color: "#F31260" }
                  : { color: "transparent" }
              }
              className="error-message"
            >
              {checkDateRegisterStart.text || checkTimeRegisterStart.text}
            </p>
          </div>
        </section>
        <section className="create-event__button-wrapper">
          <Button type="submit" className="create-event__button">
            {searchParams.get("type") === "update" ? "Cập nhật" : "Tạo mới"}
          </Button>
          {searchParams.get("type") === "update" && (
            <Button
              className="create-event__button create-event__button--cancel"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
          )}
        </section>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EventCreateUpdate;
