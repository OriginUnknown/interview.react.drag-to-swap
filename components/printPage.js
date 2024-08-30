import { useState } from "react";
import styled from "styled-components";
import Actions from "./actions";
import Photo from "./photo";
import {
  findPhotoIntersection,
  calculateDropPositionForSourceOverlapsFirstPhoto,
  calculateDropPositionForSourceOverlapsLastPhoto,
  calculateDropPositionForAdjacentPhotosOverlap,
} from "../utils/utils";

const Wrapper = styled.div`
  width: 600px;
  margin: auto;
  color: #585858;
`;

const PrintWrapper = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
`;

const PageLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: #2778a5;
  min-height: 196px;
  border-radius: 8px;
  padding: 20px;
  margin: 17px 0 42px;
  justify-content: space-between;
`;

export default function PrintPage({ data }) {
  const [positionOfSelectedImage, setPositionOfSelectedImage] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  let currentImageCount = -1;

  const prepareSourcePhotoForDragging = (event) => {
    const { height, width } = event.target.getBoundingClientRect();
    // Image to be shown when source photo is being dragged.
    const sourcePhotoDragImage = event.target.children[1];

    setPositionOfSelectedImage((prevState) => ({
      ...prevState,
      height,
      width,
    }));

    event.target.classList.add("drag-start");
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.setDragImage(sourcePhotoDragImage, 24, 24);
  };

  const getCurrentCoordsOfSourcePhoto = (event) => {
    /**
     * Call e.preventDefault();to allow the dropping of non-draggable elements
     * which have now become draggable; this also removes the not-allowed
     * cursor styling.
     */
    event.preventDefault();
    setPositionOfSelectedImage((prevState) => ({
      ...prevState,
      x: event.clientX - prevState.width / 2,
      y: event.clientY - prevState.height / 2,
    }));
  };

  const swapSourcePhoto = (event) => {
    /**
     * Call e.preventDefault(); to enable dropping elements on a web page.
     */
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("text/plain");
    const sourcePhoto = document.querySelector(`#${sourceId}`);
    const targetDropZone = event.target.parentNode.parentNode;
    /**
     * If a page is blank, append the source photo to the page
     * TODO: find out why event returns entire documrnt rather than
     * target page section.
     */
    if (event.target.id !== "") {
      const targetPage = document.querySelector(`#${event.target.id}`);

      if (!targetPage.hasChildNodes() || targetPage.children.length === 1) {
        targetPage.appendChild(sourcePhoto);
      }
      return;
    }
    /**
     * Get all photos from target dropzone
     */
    const photosFromDropZone = [...targetDropZone.children];

    /**
     * If the source image is the only image on a page being dragged,
     * do nothing.
     */
    if (
      photosFromDropZone.length === 1 &&
      sourcePhoto.id === photosFromDropZone[0].id
    ) {
      return;
    }

    /**
     * If there are two or more images on a page, calculate where to position
     * the source photo.
     */
    const closestPhotoElement = findPhotoIntersection(
      positionOfSelectedImage,
      photosFromDropZone
    );
    /**
     * If source photo hasn't overlapped with any of the photos on a page, append
     * the source image to that page.
     */
    const noOverlap = closestPhotoElement === undefined;
    // If single and source photo overlap
    const singleAndSourcePhotoOverlap =
      closestPhotoElement.previousSibling === null &&
      closestPhotoElement.nextSibling === null;

    const sourceOverlapsFirstPhoto =
      closestPhotoElement.previousSibling === null &&
      closestPhotoElement.nextSibling !== null;

    const sourceOverlapsLastPhoto =
      closestPhotoElement.previousSibling !== null &&
      closestPhotoElement.nextSibling === null;

    const adjacentPhotosOverlap =
      closestPhotoElement.previousSibling !== null &&
      closestPhotoElement.nextSibling !== null;

    if (noOverlap) {
      targetDropZone.appendChild(sourcePhoto);
      return;
    }

    console.log(">>> intersection has occurred, continue...");

    if (singleAndSourcePhotoOverlap) {
      targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
      return;
    }

    if (sourceOverlapsLastPhoto) {
      calculateDropPositionForSourceOverlapsLastPhoto(
        photosFromDropZone,
        targetDropZone,
        sourcePhoto,
        closestPhotoElement
      );
      return;
    }

    if (sourceOverlapsFirstPhoto) {
      calculateDropPositionForSourceOverlapsFirstPhoto(
        photosFromDropZone,
        targetDropZone,
        sourcePhoto,
        closestPhotoElement
      );
      return;
    }

    if (adjacentPhotosOverlap) {
      calculateDropPositionForAdjacentPhotosOverlap(
        photosFromDropZone,
        targetDropZone,
        sourcePhoto,
        closestPhotoElement
      );
      return;
    }

    console.log(">>> Anything else...");
    targetDropZone.appendChild(sourcePhoto);
  };

  const resetUIState = (event) => {
    event.target.classList.remove("drag-start");
  };

  return (
    <>
      <Wrapper>
        {Object.values(data).map((entry, i) => {
          return (
            <PrintWrapper key={i}>
              <Header>
                <Title>{entry.title}</Title>
                <Actions />
              </Header>
              <PageLayout
                id={`page-${i}`}
                onDragOver={getCurrentCoordsOfSourcePhoto}
                onDrop={swapSourcePhoto}
              >
                {entry.images.map((image) => {
                  currentImageCount = currentImageCount + 1;
                  return (
                    <Photo
                      key={image}
                      image={image}
                      currentImageCount={currentImageCount}
                      onDragStart={prepareSourcePhotoForDragging}
                      onDragEnd={resetUIState}
                    />
                  );
                })}
              </PageLayout>
            </PrintWrapper>
          );
        })}
      </Wrapper>
    </>
  );
}
