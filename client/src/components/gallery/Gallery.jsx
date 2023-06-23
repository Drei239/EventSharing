import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { CgCloseO } from "react-icons/cg";
import './Gallery.css'

const Gallery = ({ imageList }) => {
	const [images, setImages] = useState(imageList);
	const [currentImageIndex, setCurrentImageIndex] = useState(null);

	const openImage = (index) => {
		setCurrentImageIndex(index);
	};

	const closeImage = () => {
		setCurrentImageIndex(null);
	};

	const navigateImages = (direction) => {
		const lastIndex = images.length - 1;
		let newIndex;

		if (direction === 'prev') {
			newIndex = currentImageIndex === 0 ? lastIndex : currentImageIndex - 1;
		} else if (direction === 'next') {
			newIndex = currentImageIndex === lastIndex ? 0 : currentImageIndex + 1;
		}

		setCurrentImageIndex(newIndex);
	};

	return (
		<div className="gallery__content">
			<div className="image-list">
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt={""}
						onClick={() => openImage(index)}
					/>
				))}
			</div>
			{currentImageIndex !== null && (
				<div className="modal">
					<div className="modal__items">
						<span className="image__close" onClick={closeImage}>
							<CgCloseO className="gallery-item-icon" />
						</span>
						<div className="modal__btn-group">
							<Button size="xs" className="gallery__btn" onClick={() => navigateImages('prev')}>Previous</Button>
							<Button size="xs" className="gallery__btn" onClick={() => navigateImages('next')}>Next</Button>
						</div>
					</div>
					<img className="gallery__image" src={images[currentImageIndex]} alt="" />
				</div>
			)}
		</div>
	);
};

export default Gallery;