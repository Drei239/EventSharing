import React, { useEffect, useRef, useState } from 'react';
import {
  useValidateDatetime,
  useValidateRegex,
} from '../../hooks/validateHooks';
import { titleRegex } from '../../constants/regex';
import customFetch from '../../utils/axios.config';
import { Button, Dropdown, Input, Loading, Switch } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import imageCompression from 'browser-image-compression';
import provinces from '../../data/provinces.json';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const [inputValue, setInputValue] = useState({
    title: '',
    fee: '',
    quantityTicket: '',
    description: '',
    address: '',
    dateStart: '',
    dateEnd: '',
    dateRegisterEnd: '',
    timeStart: '',
    timeEnd: '',
    timeRegisterEnd: '',
  });
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [isImageEventLoaing, setIsImageEventLoaing] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [typeEvent, setTypeEvent] = useState(new Set(['offline']));
  const [category, setCategory] = useState('');
  const [banner, setBanner] = useState();
  const [imageEvent, setImageEvent] = useState([]);
  const [isFree, setIsFree] = useState(false);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

  useEffect(() => {
    customFetch
      .get('/category/all')
      .then((response) => {
        setCategoryList(response.data.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  // Compress lại hình ảnh trước khi upload
  const handleImageCompress = async (img) => {
    const option = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    };

    try {
      const compressedFile = await imageCompression(img, option);
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  };

  // RichTextEditor
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      setInputValue({
        ...inputValue,
        description: editorRef.current.getContent(),
      });
    }
  };

  // Hiện thông báo tạo thất bại
  const notifyError = () => {
    toast.error('Tạo sự kiện thất bại', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  // Hiện thông báo tạo thành công
  const notifySuccess = () => {
    toast.success('Tạo sự kiện thành công', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  // Validate tiêu đề không có ký tự đặc biệ và số
  const titleHepler = useValidateRegex(
    inputValue.title,
    titleRegex,
    'Tiêu đề không được quá 150 ký tự và không chứa ký tự đặc biệt'
  );

  // Validate giá vé chỉ được nhập số
  const feeHepler = useValidateRegex(
    inputValue.fee,
    /^[0-9]*$/,
    'Chỉ được phép nhập số'
  );

  // Validate số lượng người tham gia chỉ được nhập số
  const quantityTicketHepler = useValidateRegex(
    inputValue.quantityTicket,
    /^[0-9]*$/,
    'Chỉ được phép nhập số'
  );

  // Kiểm tra ngày bắt đầu sự kiện luôn luôn trước ngày kết thúc
  const checkDateStartEnd = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.dateStart,
    true,
    'Thời gian bắt đầu phải trước thời gian kết thúc'
  );

  // Kiểm tra ngày kết thúc sự kiện luôn luôn sau ngày bắt đầu
  const checkDateEndStart = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.dateStart,
    true,
    'Thời gian kết thúc phải sau thời gian bắt đầu'
  );

  // Kiểm tra giờ bắt đầu sự kiện luôn luôn trước giờ kết thúc
  const checkTimeStartEnd = useValidateDatetime(
    inputValue.timeEnd,
    inputValue.timeStart,
    false,
    'Thời gian bắt đầu phải trước thời gian kết thúc',
    inputValue.dateEnd,
    inputValue.dateStart
  );

  // Kiểm tra giờ kết thúc sự kiện luôn luôn sau giờ bắt đầu
  const checkTimeEndStart = useValidateDatetime(
    inputValue.timeEnd,
    inputValue.timeStart,
    false,
    'Thời gian kết thúc phải sau thời gian bắt đầu',
    inputValue.dateEnd,
    inputValue.dateStart
  );

  // Kiểm tra ngày ngưng đăng ký phải trước ngày bắt đầu
  const checkDateRegisterStart = useValidateDatetime(
    inputValue.dateStart,
    inputValue.dateRegisterEnd,
    true,
    'Thời gian dừng đăng ký phải trước thời gian bắt đầu'
  );

  // Kiểm tra giờ ngưng đăng ký phải trước giờ bắt đầu
  const checkTimeRegisterStart = useValidateDatetime(
    inputValue.timeStart,
    inputValue.timeRegisterEnd,
    false,
    'Thời gian dừng đăng ký phải trước thời gian bắt đầu',
    inputValue.dateStart,
    inputValue.dateRegisterEnd
  );

  // Corvert thời gian thành định dạng iso string
  const covertDatetimeToISO = (dateValue, time) => {
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const [hour, minute] = time.split(':');
    return new Date(year, month, day, hour, minute).toISOString();
  };

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
    let feeTicket;

    if (isFree) {
      inputValue.fee = 0;
      feeTicket = true;
    } else {
      feeTicket = inputValue.fee;
    }

    if ([...typeEvent][0].toLowerCase() === 'online') {
      isLocation = true;
    } else {
      isLocation = inputValue.address && city && district && ward;
    }

    const isSuccess =
      titleHepler.isValid &&
      feeTicket &&
      quantityTicketHepler.isValid &&
      checkDateEndStart.isValid &&
      checkDateRegisterStart.isValid &&
      inputValue.description &&
      category &&
      banner.length > 0 &&
      imageEvent.length > 0 &&
      isLocation;

    if (isSuccess) {
      const location =
        [...typeEvent][0].toLowerCase() === 'offline'
          ? `${inputValue.address}, ${[...ward][0]}, ${[...district][0]}, ${[...city][0]
          }`
          : 'Online';
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
          item.categoryName.toLowerCase() === [...category][0].toLowerCase()
      );

      const data = {
        title: inputValue.title,
        description: inputValue.description,
        banner: banner,
        imageList: imageEvent,
        category: _id,
        isOnline: [...typeEvent][0].toLowerCase() === 'online',
        fee: Number(inputValue.fee),
        location,
        timeBegin,
        timeEnd: timeEndEvent,
        timeEndSignup,
        limitUser: Number(inputValue.quantityTicket),
        creator: '6464f337c4fcda89dc23cf31',
        reviews: [],
      };

      try {
        const response = await customFetch({
          method: 'POST',
          url: '/events/create',
          data: JSON.stringify(data),
        });

        console.log(response);

        if (response.status === 200) {
          notifySuccess();

          // Reset value
          if (editorRef.current) {
            editorRef.current.setContent('');
          }
          setBanner('');
          setImageEvent([]);
          setTypeEvent(new Set(['offline']));
          setCategory('');
          setCity('');
          setDistrict('');
          setWard('');
          setIsFree(false);
          setInputValue({
            title: '',
            fee: '',
            quantityTicket: '',
            description: '',
            address: '',
            dateStart: '',
            dateEnd: '',
            dateRegisterEnd: '',
            timeStart: '',
            timeEnd: '',
            timeRegisterEnd: '',
          });
        }
      } catch (error) {
        console.log(error.response);
        notifyError();
      }

      console.log({
        title: inputValue.title,
        description: inputValue.description,
        banner: banner,
        imageList: imageEvent,
        category: _id,
        isOnline: [...typeEvent][0].toLowerCase() === 'online',
        fee: Number(inputValue.fee),
        location,
        timeBegin,
        timeEnd: timeEndEvent,
        timeEndSignup,
        limitUser: Number(inputValue.quantityTicket),
        creator: '6464f32bc4fcda89dc23cf30',
      });
    } else {
      notifyError();
    }
  };

  console.log('imgaEvent', imageEvent);

  return (
    <div className="create-event">
      <h2>Tạo sự kiện mới</h2>
      <p
        style={{
          color: 'gray',
          marginTop: '-10px',
          marginBottom: '30px',
          fontSize: '0.9rem',
        }}
      >
        Nhập đầy đủ thông tin trước khi nhấn tạo sự kiện.
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
              setIsBannerLoading(true);
              const reader = new FileReader();

              reader.onload = () => {
                setIsBannerLoading(false);
                setBanner(reader.result);
              };
              if (e.target.files[0]) {
                const img = await handleImageCompress(e.target.files[0]);
                reader.readAsDataURL(img);
              } else {
                setIsBannerLoading(false);
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
                style={{ color: '#F31260', cursor: 'pointer' }}
                onClick={() => {
                  setBanner('');
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
              setIsImageEventLoaing(true);
              const reader = new FileReader();
              const imageList = [...e.target.files];

              if (imageList) {
                console.log('first');
                const images = [];
                imageList?.map((item) => {
                  reader.onload = () => {
                    images.push(reader.result);
                    setIsImageEventLoaing(false);
                    setImageEvent([...imageEvent, ...images]);
                  };

                  handleImageCompress(item)
                    .then((result) => reader.readAsDataURL(result))
                    .catch((error) => {
                      console.log(error);
                    });
                });
              } else {
                setIsImageEventLoaing(false);
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
                    style={{ color: '#F31260', cursor: 'pointer' }}
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
              style={{ textAlign: 'right' }}
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
            style={{ textAlign: 'right' }}
            onChange={handleOnchange}
          />
          <div className="create-event__form--display">
            <span>Hình thức tổ chức</span>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {typeEvent}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Hình thức tổ chức"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={setTypeEvent}
              >
                <Dropdown.Item key="offline">Offline</Dropdown.Item>
                <Dropdown.Item key="online">Online</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="create-event__form--display">
            <span>Thể loại</span>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {category || 'Hãy chọn'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Thể loại"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={setCategory}
              >
                {categoryList?.map((item) => (
                  <Dropdown.Item key={item.categoryName}>
                    {item.categoryName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {[...typeEvent][0].toLowerCase() === 'offline' && (
          <div className="create-event__address">
            <Input
              label="Địa điểm tổ chức"
              name="address"
              placeholder="Số nhà, tên đường"
              value={inputValue.address}
              onChange={handleOnchange}
            />
            <br />
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {city || 'Tỉnh/Thành phố'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Tỉnh thành"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={setCity}
              >
                {provinces.sort(compare).map((item, index) => {
                  return (
                    <Dropdown.Item key={item.name}>{item.name}</Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Button
                disabled={city ? false : true}
                flat
                css={{ tt: 'capitalize' }}
              >
                {district || 'Quận/Huyện'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Quận huyện"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={setDistrict}
              >
                {city &&
                  provinces
                    .find((item) => item.name === [...city][0])
                    .districts.sort(compare)
                    .map((item) => (
                      <Dropdown.Item key={item.name}>{item.name}</Dropdown.Item>
                    ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Button
                disabled={district ? false : true}
                flat
                css={{ tt: 'capitalize' }}
              >
                {ward || 'Phường/Xã'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Phường xã"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={setWard}
              >
                {district &&
                  provinces
                    .find((item) => item.name === [...city][0])
                    .districts.find((item) => item.name === [...district][0])
                    .wards.sort(compare)
                    .map((item) => (
                      <Dropdown.Item key={item.name}>{item.name}</Dropdown.Item>
                    ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}

        <p className="create-event__description">Mô tả sự kiện</p>
        <Editor
          apiKey="g5gefqfa9aseg305uetdofxk90iaoyhlyjrtwsewiaadf6sq"
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
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
                  ? { color: '#F31260' }
                  : { color: 'transparent' }
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
                  ? { color: '#F31260' }
                  : { color: 'transparent' }
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
                  ? { color: '#F31260' }
                  : { color: 'transparent' }
              }
              className="error-message"
            >
              {checkDateRegisterStart.text || checkTimeRegisterStart.text}
            </p>
          </div>
        </section>
        <Button type="submit" className="create-event__button">
          Tạo mới
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEventPage;
