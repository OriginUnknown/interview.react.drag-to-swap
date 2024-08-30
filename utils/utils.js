// utils
/**
 * @param {*} sourceCoords
 * @param {*} photoElements
 * @returns HTML element closest to the location of the source photo element.
 */
export const findPhotoIntersection = (sourceCoords, photoElements) =>
  photoElements.find((photoElement) => {
    const { x, y, height, width } = photoElement.getBoundingClientRect();
    const horizontalDetection =
      sourceCoords.x < x + width && sourceCoords.x + sourceCoords.width > x;
    const verticalDetection =
      sourceCoords.y < y + height && sourceCoords.y + sourceCoords.height > y;
    /**
     * Area of Intersection: Check if any of the photo elements overlap/intersect
     * with the current position of the source element in the document.
     */
    const photosIntersect = horizontalDetection && verticalDetection;

    if (photosIntersect) return photoElement;
    /**
     * Just in case the interset boundaries are not clear cut and both
     * elements are returned return the first closest node found.
     */
  });

const findSourcePhotoOnPage = (photoElements, sourcePhoto) =>
  !!photoElements.find((photoElement) => photoElement.id === sourcePhoto.id);

const getPositionOfNode = (photoElements, node) =>
  photoElements.findIndex((photoElement) => photoElement.id === node.id);

const diffInPosition = (positionOne, positionTwo) =>
  positionOne - positionTwo === 2 || positionTwo - positionOne === 2;

export const calculateDropPositionForSourceOverlapsFirstPhoto = (
  photosFromDropZone,
  targetDropZone,
  sourcePhoto,
  closestPhotoElement
) => {
  const doesPhotoExistOnPage = findSourcePhotoOnPage(
    photosFromDropZone,
    sourcePhoto
  );
  const positionOfSourceNode = getPositionOfNode(
    photosFromDropZone,
    sourcePhoto
  );
  const positionOfClosestNode = getPositionOfNode(
    photosFromDropZone,
    closestPhotoElement
  );
  const diffInPosIsTwo = diffInPosition(
    positionOfSourceNode,
    positionOfClosestNode
  );
  const adjacentPhotoSwapRightLeft =
    closestPhotoElement.nextSibling.id === sourcePhoto.id;

  if (!doesPhotoExistOnPage || adjacentPhotoSwapRightLeft) {
    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
    return;
  }

  // Bottom / Top swap
  if (diffInPosIsTwo && positionOfSourceNode > positionOfClosestNode) {
    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode].nextSibling
    );
    return;
  }

  // Diagonal swap Bottom / Top right corner AND last node Bottom / Top swap
  targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
  targetDropZone.appendChild(closestPhotoElement);
  return;
};

export const calculateDropPositionForSourceOverlapsLastPhoto = (
  photosFromDropZone,
  targetDropZone,
  sourcePhoto,
  closestPhotoElement
) => {
  const doesPhotoExistOnPage = findSourcePhotoOnPage(
    photosFromDropZone,
    sourcePhoto
  );
  const positionOfSourceNode = getPositionOfNode(
    photosFromDropZone,
    sourcePhoto
  );
  const positionOfClosestNode = getPositionOfNode(
    photosFromDropZone,
    closestPhotoElement
  );

  // Swap left / right
  if (
    closestPhotoElement.previousSibling.id === sourcePhoto.id ||
    !doesPhotoExistOnPage
  ) {
    targetDropZone.appendChild(sourcePhoto);
    return;
  }

  // Swap photos... Top to bottom
  targetDropZone.insertBefore(
    sourcePhoto,
    targetDropZone.children[positionOfClosestNode]
  );
  targetDropZone.insertBefore(
    closestPhotoElement,
    targetDropZone.children[positionOfSourceNode]
  );
  return;
};

export const calculateDropPositionForAdjacentPhotosOverlap = (
  photosFromDropZone,
  targetDropZone,
  sourcePhoto,
  closestPhotoElement
) => {
  const sourcePhotoIsBeforeClosest =
    closestPhotoElement.previousSibling.id === sourcePhoto.id;
  const closestPhotoIsBeforeSource =
    closestPhotoElement.nextSibling.id === sourcePhoto.id;
  const positionOfSourceNode = getPositionOfNode(
    photosFromDropZone,
    sourcePhoto
  );
  const positionOfClosestNode = getPositionOfNode(
    photosFromDropZone,
    closestPhotoElement
  );
  const diffInPosIsTwo = diffInPosition(
    positionOfSourceNode,
    positionOfClosestNode
  );

  // Swap adjacent nodes
  if (sourcePhotoIsBeforeClosest) {
    targetDropZone.insertBefore(closestPhotoElement, sourcePhoto);
    return;
  }

  if (closestPhotoIsBeforeSource) {
    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
    return;
  }

  // Swap Bottom / Top
  if (diffInPosIsTwo && positionOfSourceNode > positionOfClosestNode) {
    targetDropZone.insertBefore(
      sourcePhoto,
      targetDropZone.children[positionOfClosestNode]
    );
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode]
    );
    return;
  }

  // Swap Top / Bottom
  if (diffInPosIsTwo && positionOfSourceNode < positionOfClosestNode) {
    targetDropZone.insertBefore(
      sourcePhoto,
      targetDropZone.children[positionOfClosestNode]
    );
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode]
    );
  }
  return;
};
