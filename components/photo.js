import { Fragment } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; visibility: visible; }
`;

const resizeAndScale = keyframes`
  0% {
    opacity: 0;
    transform: scale3d(.5, .5, 1);
    border-radius: 100%;
    border: 4px solid #FFF;
  }
  100% {
    opacity: 1;
    visibility: visible;
    transform: scale3d(1, 1, 1);
    border-radius: 0;
    border: none;
  }
`;
const PrintPhoto = styled.div`
  width: calc(50% - 10px);
  margin-top: 10px;
  :nth-child(-n + 2) {
    margin-top: 0;
  }

  &.drag-start {
    opacity: 0.75;
  }

  img {
    max-width: 100%;

    &#clone-top-left,
    &#clone-top-right,
    &#clone-bottom-right {
      position: absolute;
      height: auto;
      width: calc(50% - 30px);
    }

    &#clone-bottom-left {
      position: relative;
      top: 0;
      height: auto;
      width: 100%;
    }

    &.resize-scale-bottom-left,
    &.fade-in-bottom-left {
      position: absolute;
      left: 20px;
      height: auto;
      width: calc(50% - 30px);
      left: 20px;
    }

    &.resize-scale-bottom-right,
    &.fade-in-bottom-right {
      position: absolute;
      height: auto;
      width: calc(50% - 30px);
    }

    &.fade-in-top-left,
    &.resize-scale-top-left {
      position: absolute;
      height: auto;
      width: calc(50% - 30px);
      top: 20px;
      left: 20px;
    }

    &.fade-in-top-right,
    &.resize-scale-top-right {
      position: relative;
      height: auto;
      width: 100%;
    }
  }

  .fade-in-top-left,
  .fade-in-top-right,
  .fade-in-bottom-left,
  .fade-in-bottom-right {
    animation: ${fadeIn} 500ms ease-in-out;
    animation-fill-mode: forwards;
  }

  .resize-scale-top-left,
  .resize-scale-top-right,
  .resize-scale-bottom-left,
  .resize-scale-bottom-right {
    animation: ${resizeAndScale} 500ms ease-in-out;
    animation-fill-mode: forwards;
  }
`;

const DraggableIcon = styled.img`
  border-radius: 50px;
  border: 4px solid #fff;
  position: absolute;
  left: -10000px;
  height: 48px;
  width: 48px;
`;

export default function Photo({
  image,
  currentImageCount,
  onDragStart,
  onDragEnd,
}) {
  return (
    <Fragment key={`drag-${currentImageCount}`}>
      <PrintPhoto
        id={`imageContainer-${currentImageCount}`}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggable="true"
      >
        <img src={image} alt="" draggable="false" />
        <DraggableIcon
          id={`draggable-image-${currentImageCount}`}
          src={image}
        />
      </PrintPhoto>
    </Fragment>
  );
}
