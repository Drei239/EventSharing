import React, { useState } from 'react';
import { useValidateRegex } from '../../hooks/useValidate';
import { titleRegex } from '../../constants/regex';
import { Button, Dropdown, Input, Textarea } from '@nextui-org/react';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const [inputValue, setInputValue] = useState({
    title: '',
    fee: 0,
    description: '',
    dateStart: '',
    dateEnd: '',
    dateRegisterEnd: '',
    timeStart: '',
    timeEnd: '',
    timeRegisterEnd: '',
  });
  const [typeEvent, setTypeEvent] = useState(new Set(['offline']));
  const [category, setCategory] = useState(new Set(['nhạc_sống']));
  const [banner, setBanner] = useState();
  const [imageEvent, setImageEvent] = useState([]);

  const selecteTypeEvent = React.useMemo(
    () => Array.from(typeEvent).join(', ').replaceAll('_', ' '),
    [typeEvent]
  );

  const selecteCategory = React.useMemo(
    () => Array.from(category).join(', ').replaceAll('_', ' '),
    [category]
  );

  const titleHepler = useValidateRegex(
    inputValue.title,
    titleRegex,
    'Tiêu đề không được quá 150 ký tự và không chứa ký tự đặc biệt'
  );

  const feeHepler = useValidateRegex(
    inputValue.fee,
    /^[0-9]*$/,
    'Chỉ được phép nhập số'
  );

  const handleOnchange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  return (
    <div className="create-event">
      <h2>Tạo sự kiện mới</h2>
      <form className="create-event__form">
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
            onChange={(e) => setBanner(e.target.files[0])}
          />
        </div>
        {banner && (
          <div className="create-envent__image-input-preview">
            <div>
              <img src={URL.createObjectURL(banner)} alt={banner.name} />
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
                onClick={() => setBanner('')}
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
            onChange={(e) => setImageEvent([...imageEvent, e.target.files[0]])}
          />
        </div>
        {imageEvent && (
          <div className="create-envent__image-input-preview create-envent__image-input-preview--display">
            {imageEvent?.map((img, index) => {
              return (
                <div key={index}>
                  <img src={URL.createObjectURL(img)} alt={img.name} />
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

        <div className="create-event__type-fee">
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
          <div className="create-event__form--display">
            <span>Hình thức tổ chức</span>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {selecteTypeEvent}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Hình thức tổ chức"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selecteTypeEvent}
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
                {selecteCategory}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Thể loại"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selecteCategory}
                onSelectionChange={setCategory}
              >
                <Dropdown.Item key="nhạc_sống">Nhạc sống</Dropdown.Item>
                <Dropdown.Item key="sân_khấu">Sân khấu</Dropdown.Item>
                <Dropdown.Item key="nghệ_thuật">Nghệ thuật</Dropdown.Item>
                <Dropdown.Item key="thể_thao">Thể thao</Dropdown.Item>
                <Dropdown.Item key="tham_quan_du_lịch">
                  Tham quan du lịch
                </Dropdown.Item>
                <Dropdown.Item key="hội_thảo">Hội thảo</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <Textarea
          label="Mô tả chi tiết"
          name="description"
          placeholder="Giới thiệu chi tiết về sự kiện"
          minRows={5}
          maxRows={20}
          onChange={handleOnchange}
        />

        <section className="create-event__time--display">
          <div className="create-event__time">
            <p>Thời gian bắt đầu</p>
            <Input
              aria-label="ngày bắt đầu"
              type="date"
              name="dateStart"
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ bắt đầu"
              type="time"
              name="timeStart"
              onChange={handleOnchange}
            />
          </div>
          <div className="create-event__time">
            <p>Thời gian kết thúc</p>
            <Input
              aria-label="ngày kết thúc"
              type="date"
              name="dateEnd"
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ kết thúc"
              type="time"
              name="timeEnd"
              onChange={handleOnchange}
            />
          </div>
          <div className="create-event__time">
            <p>Thời gian ngưng nhận đăng ký</p>
            <Input
              aria-label="ngày kết thúc đăng ký"
              type="date"
              name="dateRegisterEnd"
              onChange={handleOnchange}
            />
            <Input
              aria-label="giờ kết thúc đăng ký"
              type="time"
              name="timeRegisterEnd"
              onChange={handleOnchange}
            />
          </div>
        </section>
        <Button type="submit" className="create-event__button">
          Tạo mới
        </Button>
      </form>
    </div>
  );
};

export default CreateEventPage;
