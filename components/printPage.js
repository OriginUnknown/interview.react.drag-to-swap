import { useState } from "react";
import styled from "styled-components";
import Actions from "./actions";
import Photo from "./photo";
import {
  findPhotoIntersection,
  calculateDropPositionForAdjacentPhotosOverlap,
  calculateDropPositionForEmptyPage,
  calculateDropPositionForSingleAndSourcePhotoOverlap,
  calculateDropPositionForSourceOverlapsFirstPhoto,
  calculateDropPositionForSourceOverlapsLastPhoto,
  removeAnimationClasses,
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
  position: relative;
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
  const initialMouseCoords = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };
  const [positionOfSelectedImage, setPositionOfSelectedImage] =
    useState(initialMouseCoords);

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
    // Vacant page...
    if (event.target.id !== "") {
      calculateDropPositionForEmptyPage(event, sourcePhoto);
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
     * If there two or more images on a page have intersected, calculate
     * the where to position the source photo based on the value of the
     * `closestPhotoElement` variable.
     */
    const closestPhotoElement = findPhotoIntersection(
      positionOfSelectedImage,
      photosFromDropZone
    );
    /**
     * Possible permutations of where to place to drop a photo on a page.
     */
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

    console.log(">>> intersection has occurred, continue...");

    if (singleAndSourcePhotoOverlap) {
      calculateDropPositionForSingleAndSourcePhotoOverlap(
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

    if (sourceOverlapsLastPhoto) {
      calculateDropPositionForSourceOverlapsLastPhoto(
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

    /**
     * Catch all clause just in case there's a scenario that hasn't been
     * considered.
     */
    console.log(">>> Anything else...");
    targetDropZone.appendChild(sourcePhoto);
    return;
  };

  const resetUIState = (event) => {
    removeAnimationClasses(event);
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
