import { Fragment } from 'react';
import styled from "styled-components";

const PrintPhoto = styled.div`
  width: calc(50% - 10px);
  margin-top: 10px;
  :nth-child(-n+2) {
    margin-top: 0;
  }

  &.drag-start {
    opacity: .5;
  }

  img {
    max-width: 100%;
  }
`;

const DraggableIcon = styled.img`
  border-radius: 50px;
  border: 4px solid #FFF;
  position: absolute;
  left: -10000px;
  height: 48px;
  width: 48px;
`;

export default function Photo ({ image, currentImageCount, onDragStart, onDragEnd }) {
    return (
        <Fragment key={`drag-${currentImageCount}`}>
            <PrintPhoto
                id={`imageContainer-${currentImageCount}`}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                draggable="true">
                <img src={image} alt="" draggable="false" />
                <DraggableIcon id={`draggable-image-${image}`} src={image} />
            </PrintPhoto>
      </Fragment>
     
    )}