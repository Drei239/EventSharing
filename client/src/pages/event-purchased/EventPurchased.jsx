import { useEffect, useRef, useState } from 'react';
import customFetch from '../../utils/axios.config';
import Card from '../../components/cardEvent/cardEvent';
import { Button, Modal } from '@nextui-org/react';
import QRCode from 'qrcode';
import './EventPurchased.css';

const EventPurchased = () => {
  const [orderList, setOrderList] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});
  const [dateTimeStart, setDateTimeStart] = useState({
    day: '',
    month: '',
    year: '',
    hour: '',
    minutes: '',
  });
  const [dateTimeEnd, setDateTimeEnd] = useState({
    day: '',
    month: '',
    year: '',
    hour: '',
    minutes: '',
  });
  const [visible, setVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [selectValue, setSelectValue] = useState('Public');

  useEffect(() => {
    customFetch.get('/orders/user').then((resp) => setOrderList(resp.data));
  }, []);

  useEffect(() => {
    const dateStart = new Date(orderDetail.event?.timeBegin);
    setDateTimeStart({
      day: dateStart.getDate(),
      month: dateStart.getMonth() + 1,
      year: dateStart.getFullYear(),
      hour: dateStart.getHours(),
      minutes: dateStart.getMinutes(),
    });

    const dateEnd = new Date(orderDetail.event?.timeEnd);
    setDateTimeEnd({
      day: dateEnd.getDate(),
      month: dateEnd.getMonth() + 1,
      year: dateEnd.getFullYear(),
      hour: dateEnd.getHours(),
      minutes: dateEnd.getMinutes(),
    });

    QRCode.toDataURL(orderDetail?._id, function (err, url) {
      setQrUrl(url);
    });
  }, [orderDetail]);

  const closeHandler = () => {
    setVisible(false);
  };

  const handleVisibleModal = (id) => {
    setVisible(true);
    const order = orderList.find((item) => item.event._id === id);
    setOrderDetail(order);
  };

  const handleDownloadQRCode = () => {
    const imgSrc = document.getElementById('qr-code').src;
    const downloadLink = document.createElement('a');
    downloadLink.href = imgSrc;
    downloadLink.download = 'QRcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <section className='event-purchased'>
      <h3>Sự kiện đã đăng ký</h3>
      <select
        className='event-purchased__dropdown'
        onChange={(e) => setSelectValue(e.target.value)}
      >
        <option value='Public'>Sắp diễn ra</option>
        <option value='Complete'>Kết thúc</option>
      </select>
      <section className='event-purchased__card'>
        {orderList
          ?.filter((item) => item.event.status === selectValue)
          .map((item, index) => (
            <Card
              {...item.event}
              key={index}
              handleVisibleModal={handleVisibleModal}
              purchased={true}
            />
          ))}
      </section>

      <Modal
        closeButton
        blur
        width='45%'
        aria-labelledby='modal-title'
        open={visible}
        onClose={closeHandler}
        css={{ padding: '20px' }}
      >
        <Modal.Header>
          <h3>Thông tin chi tiết</h3>
        </Modal.Header>

        <section className='event-purchased__info'>
          <p>Mã đơn hàng: </p>
          <p>#{orderDetail?._id}</p>
        </section>

        <section className='event-purchased__info'>
          <p>Tên sự kiện: </p>
          <p>{orderDetail.event?.title}</p>
        </section>

        <section className='event-purchased__info'>
          <p>Thời gian diễn ra: </p>
          <p>{`Ngày ${dateTimeStart.day} tháng ${dateTimeStart.month} năm ${
            dateTimeStart.year
          }, ${('0' + dateTimeStart.hour).slice(-2)} giờ ${(
            '0' + dateTimeStart.minutes
          ).slice(-2)}`}</p>
        </section>

        <section className='event-purchased__info'>
          <p>Thời gian kết thúc: </p>
          <p>{`Ngày ${dateTimeEnd.day} tháng ${dateTimeEnd.month} năm ${
            dateTimeEnd.year
          }, ${('0' + dateTimeEnd.hour).slice(-2)} giờ ${(
            '0' + dateTimeEnd.minutes
          ).slice(-2)}`}</p>
        </section>

        {orderDetail.event?.isOnline ? (
          <section className='event-purchased__info'>
            <p>Link tham gia: </p>
            <p>{orderDetail.event?.linkOnline}</p>
          </section>
        ) : (
          <section className='event-purchased__info'>
            <p>Địa chỉ: </p>
            <p>{`${orderDetail.event?.location.address}, ${orderDetail.event?.location.ward.name}, ${orderDetail.event?.location.district.name}, ${orderDetail.event?.location.province.name}`}</p>
          </section>
        )}

        <section className='event-purchased__info'>
          <p>Xác nhận thanh toán: </p>
          <p>{orderDetail?.isPaid ? 'Đã thanh toán' : 'Đang chờ xác nhận'}</p>
        </section>
        {orderDetail?.isPaid && (
          <section className='event-purchase__qrcode'>
            <img src={qrUrl} id='qr-code' alt='QR code' />
            <Button onClick={handleDownloadQRCode}>Tải QR Code</Button>
          </section>
        )}
      </Modal>
    </section>
  );
};
export default EventPurchased;
