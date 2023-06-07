import React, { useRef, useState } from 'react';
import { useValidateDatetime, useValidateRegex } from '../../hooks/useValidate';
import { titleRegex } from '../../constants/regex';
import { Button, Dropdown, Input, Switch, Textarea } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
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
  const [typeEvent, setTypeEvent] = useState(new Set(['offline']));
  const [category, setCategory] = useState(new Set(['nhạc sống']));
  const [banner, setBanner] = useState();
  const [imageEvent, setImageEvent] = useState([]);
  const [isFree, setIsFree] = useState(true);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

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
    });
  };

  // Hiện thông báo tạo thành công
  const notifySuccess = () => {
    toast.success('Tạo sự kiện thành công', {
      position: toast.POSITION.TOP_RIGHT,
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

  // Kiểm tra thời gian bắt đầu sự kiện luôn luôn trước thời gian kết thúc
  const checkDateStartEnd = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.timeEnd,
    inputValue.dateStart,
    inputValue.timeStart,
    'Thời gian bắt đầu phải trước thời gian kết thúc'
  );

  // Kiểm tra thời gian kết thúc sự kiện luôn luôn sau thời gian bắt đầu
  const checkDateEndStart = useValidateDatetime(
    inputValue.dateEnd,
    inputValue.timeEnd,
    inputValue.dateStart,
    inputValue.timeStart,
    'Thời gian kết thúc phải sau thời gian bắt đầu'
  );

  // Kiểm tra thời gian ngưng đăng ký phải trước ngày bắt đầu
  const checkDateRegisterStart = useValidateDatetime(
    inputValue.dateStart,
    inputValue.timeStart,
    inputValue.dateRegisterEnd,
    inputValue.timeRegisterEnd,
    'Thời gian dừng đăng ký phải trước thời gian bắt đầu'
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
  const handleSubmit = (e) => {
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
      banner.length > 0 &&
      imageEvent.length > 0 &&
      isLocation;

    if (isSuccess) {
      const location =
        [...typeEvent][0].toLowerCase() === 'offline'
          ? `${inputValue.address}, ${[...ward][0]}, ${[...district][0]}, ${
              [...city][0]
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
      notifySuccess();
      console.log({
        title: inputValue.title,
        description: inputValue.description,
        banner: banner,
        imageList: imageEvent,
        category: [...category][0],
        type: [...typeEvent][0].toLowerCase() === 'offline',
        fee: inputValue.fee,
        location,
        timeBegin,
        timeEnd: timeEndEvent,
        timeEndSignup,
      });
    } else {
      notifyError();
    }
  };

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
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () => setBanner(reader.result);
              if (e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
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
            name="banner"
            className="file-input"
            accept="image/*"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () =>
                setImageEvent([...imageEvent, reader.result]);
              if (e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </div>
        {imageEvent && (
          <div className="create-envent__image-input-preview create-envent__image-input-preview--display">
            {imageEvent?.map((img, index) => {
              return (
                <div key={index}>
                  <img src={img} alt="image event" />
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
          <span>Sự kiện bán vé</span>
          <Switch size="xs" onChange={() => setIsFree(!isFree)} />
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
                {category}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Thể loại"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={setCategory}
              >
                <Dropdown.Item key="nhạc sống">Nhạc sống</Dropdown.Item>
                <Dropdown.Item key="sân khấu">Sân khấu</Dropdown.Item>
                <Dropdown.Item key="nghệ thuật">Nghệ thuật</Dropdown.Item>
                <Dropdown.Item key="thể thao">Thể thao</Dropdown.Item>
                <Dropdown.Item key="tham quan du lịch">
                  Tham quan du lịch
                </Dropdown.Item>
                <Dropdown.Item key="hội thảo">Hội thảo</Dropdown.Item>
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
              status={checkDateStartEnd.color}
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ bắt đầu"
              type="time"
              name="timeStart"
              status={checkDateStartEnd.color}
              onChange={handleOnchange}
            />
            <p
              style={
                checkDateStartEnd.color
                  ? { color: '#F31260' }
                  : { color: 'transparent' }
              }
              className="error-message"
            >
              {checkDateStartEnd.text}
            </p>
          </div>
          <div className="create-event__time">
            <p>Thời gian kết thúc</p>
            <Input
              aria-label="ngày kết thúc"
              type="date"
              name="dateEnd"
              status={checkDateEndStart.color}
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ kết thúc"
              type="time"
              name="timeEnd"
              status={checkDateEndStart.color}
              onChange={handleOnchange}
            />
            <p
              style={
                checkDateEndStart.color
                  ? { color: '#F31260' }
                  : { color: 'transparent' }
              }
              className="error-message"
            >
              {checkDateEndStart.text}
            </p>
          </div>
          <div className="create-event__time">
            <p>Thời gian ngưng nhận đăng ký</p>
            <Input
              aria-label="ngày kết thúc đăng ký"
              type="date"
              name="dateRegisterEnd"
              status={checkDateRegisterStart.color}
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ kết thúc đăng ký"
              type="time"
              name="timeRegisterEnd"
              status={checkDateRegisterStart.color}
              onChange={handleOnchange}
            />
            <p
              style={
                checkDateRegisterStart.color
                  ? { color: '#F31260' }
                  : { color: 'transparent' }
              }
              className="error-message"
            >
              {checkDateRegisterStart.text}
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
