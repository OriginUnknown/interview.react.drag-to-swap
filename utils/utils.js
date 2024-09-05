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

export const calculateDropPositionForSingleAndSourcePhotoOverlap = (
  targetDropZone,
  sourcePhoto,
  closestPhotoElement
) => {
  const sourcePhotoImage = sourcePhoto.querySelectorAll("img")[0];
  const closestElementImage = closestPhotoElement.querySelectorAll("img")[0];
  const cloneClosestPhotoImage = closestElementImage.cloneNode(true);

  cloneClosestPhotoImage.id = "clone-top-right";
  sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
  targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);

  /**
   * Animate: Resize/scale between closest element and source but only
   * fade in the closest photo at its new location.
   */
  closestElementImage.classList.add("fade-in-top-right");
  sourcePhotoImage.classList.add("resize-scale-top-left");
  return;
};

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

  const sourcePhotoImage = sourcePhoto.querySelectorAll("img")[0];
  const closestElementImage = closestPhotoElement.querySelectorAll("img")[0];

  const cloneSourcePhotoImage = sourcePhotoImage.cloneNode(true);
  const cloneClosestPhotoImage = closestElementImage.cloneNode(true);

  // Adjacent swap: top / right -> top / left w/ up to two photos on a page.
  if (!doesPhotoExistOnPage || adjacentPhotoSwapRightLeft) {
    cloneClosestPhotoImage.id = "clone-top-left";
    cloneSourcePhotoImage.id = "clone-top-right";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);

    closestElementImage.classList.add("fade-in-top-right");
    sourcePhotoImage.classList.add("resize-scale-top-left");
    return;
  }

  // Bottom left / Top left swap
  if (diffInPosIsTwo && positionOfSourceNode > positionOfClosestNode) {
    cloneClosestPhotoImage.id = "clone-top-left";
    cloneSourcePhotoImage.id = "clone-bottom-left";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode].nextSibling
    );

    closestElementImage.classList.add("fade-in-bottom-left");
    sourcePhotoImage.classList.add("resize-scale-bottom-left");
    return;
  }

  // Diagonal swap: Bottom right / top left
  cloneClosestPhotoImage.id = "clone-bottom-left";
  cloneSourcePhotoImage.id = "clone-top-right";

  sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
  closestPhotoElement.insertBefore(cloneSourcePhotoImage, closestElementImage);

  targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
  targetDropZone.appendChild(closestPhotoElement);

  closestElementImage.classList.add("fade-in-bottom-right");
  sourcePhotoImage.classList.add("resize-scale-top-left");
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

  const diffInPosIsTwo = diffInPosition(
    positionOfSourceNode,
    positionOfClosestNode
  );
  const sourcePhotoImage = sourcePhoto.querySelectorAll("img")[0];
  const closestElementImage = closestPhotoElement.querySelectorAll("img")[0];

  const cloneSourcePhotoImage = sourcePhotoImage.cloneNode(true);
  const cloneClosestPhotoImage = closestElementImage.cloneNode(true);

  if (!doesPhotoExistOnPage) {
    console.log(">>> brand new photo on page");
    // const sourcePhotoImage = sourcePhoto.querySelectorAll('img')[0];
    targetDropZone.appendChild(sourcePhoto);

    // To trigger animation, append the CSS class containing the animation
    sourcePhotoImage.classList.add("fade-in-bottom-right");
    return;
  }

  // Adjacent swap: top left / top right
  if (
    closestPhotoElement.previousSibling.id === sourcePhoto.id &&
    targetDropZone.children.length === 2
  ) {
    cloneClosestPhotoImage.id = "clone-top-right";
    cloneSourcePhotoImage.id = "clone-top-left";
    /**
     * Insert cloned photos into their opposite counterparts so that it's the first
     * image element of its parent.
     */
    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    // Make the drop
    targetDropZone.appendChild(sourcePhoto);

    // Then trigger the transition animations
    closestElementImage.classList.add("fade-in-top-left");
    sourcePhotoImage.classList.add("resize-scale-top-right");
    return;
  }

  // Top right / bottom left if there's an odd number of photos on a page
  if (
    closestPhotoElement.previousSibling.id === sourcePhoto.id &&
    !diffInPosIsTwo
  ) {
    cloneClosestPhotoImage.id = "clone-bottom-left";
    cloneSourcePhotoImage.id = "clone-top-right";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.appendChild(sourcePhoto);

    closestElementImage.classList.add("fade-in-top-right");
    sourcePhotoImage.classList.add("resize-scale-bottom-left");
    return;
  }

  // Adjacent swap: bottom left / bottom right
  // TODO: needs fixing when handling four or more photos
  if (closestPhotoElement.previousSibling.id === sourcePhoto.id) {
    cloneClosestPhotoImage.id = "clone-bottom-right";
    cloneSourcePhotoImage.id = "clone-bottom-left";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);

    closestElementImage.classList.add("fade-in-bottom-left");
    sourcePhotoImage.classList.add("resize-scale-bottom-right");
    return;
  }

  // Swap photos... Top / left ->  bottom / left
  if (
    diffInPosIsTwo &&
    positionOfSourceNode < positionOfClosestNode &&
    closestPhotoElement.id === targetDropZone.lastChild.id
  ) {
    cloneClosestPhotoImage.id = "clone-bottom-left";
    cloneSourcePhotoImage.id = "clone-top-left";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(
      sourcePhoto,
      targetDropZone.children[positionOfClosestNode]
    );
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode]
    );

    closestElementImage.classList.add("fade-in-top-left");
    sourcePhotoImage.classList.add("resize-scale-bottom-left");
    return;
  }
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

  const sourcePhotoImage = sourcePhoto.querySelectorAll("img")[0];
  const closestElementImage = closestPhotoElement.querySelectorAll("img")[0];

  const cloneSourcePhotoImage = sourcePhotoImage.cloneNode(true);
  const cloneClosestPhotoImage = closestElementImage.cloneNode(true);

  // Swap adjacent nodes: top right / bottom left
  if (sourcePhotoIsBeforeClosest) {
    cloneClosestPhotoImage.id = "clone-bottom-left";
    cloneSourcePhotoImage.id = "clone-top-right";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(closestPhotoElement, sourcePhoto);

    closestElementImage.classList.add("fade-in-top-right");
    sourcePhotoImage.classList.add("resize-scale-bottom-left");
    return;
  }

  if (closestPhotoIsBeforeSource) {
    // Swap: Bottom right / bottom left...
    if (targetDropZone.lastChild.id === sourcePhoto.id && diffInPosIsTwo) {
      cloneClosestPhotoImage.id = "clone-bottom-left";
      cloneSourcePhotoImage.id = "clone-bottom-right";

      sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
      closestPhotoElement.insertBefore(
        cloneSourcePhotoImage,
        closestElementImage
      );

      targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);

      closestElementImage.classList.add("fade-in-bottom-right");
      sourcePhotoImage.classList.add("resize-scale-bottom-left");
      return;
    }
    // Diagonal swap: Bottom left / Top right
    cloneClosestPhotoImage.id = "clone-top-right";
    cloneSourcePhotoImage.id = "clone-bottom-left";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(sourcePhoto, closestPhotoElement);
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode].nextSibling
    );

    closestElementImage.classList.add("fade-in-bottom-left");
    sourcePhotoImage.classList.add("resize-scale-top-right");
    return;
  }

  // Swap adjacent nodes: Swap Top right / Bottom right
  if (
    diffInPosIsTwo &&
    positionOfSourceNode < positionOfClosestNode &&
    closestPhotoElement.id !== targetDropZone.lastChild.id
  ) {
    cloneClosestPhotoImage.id = "clone-bottom-left";
    cloneSourcePhotoImage.id = "clone-top-left";

    sourcePhoto.insertBefore(cloneClosestPhotoImage, sourcePhotoImage);
    closestPhotoElement.insertBefore(
      cloneSourcePhotoImage,
      closestElementImage
    );

    targetDropZone.insertBefore(
      sourcePhoto,
      targetDropZone.children[positionOfClosestNode]
    );
    targetDropZone.insertBefore(
      closestPhotoElement,
      targetDropZone.children[positionOfSourceNode]
    );

    closestElementImage.classList.add("fade-in-top-left");
    sourcePhotoImage.classList.add("resize-scale-bottom-left");
  }
  return;
};

// Vacant page
export const calculateDropPositionForEmptyPage = (event, sourcePhoto) => {
  const targetPage = document.querySelector(`#${event.target.id}`);
  const sourcePhotoImage = sourcePhoto.querySelectorAll("img")[0];
  sourcePhoto.classList.remove("drag-start");
  targetPage.appendChild(sourcePhoto);
  /**
   * If there't a single photo on the page and the source photo is
   * placed adjacent to it, only fade in the source image on the RHS.
   */
  if (targetPage.hasChildNodes()) {
    sourcePhotoImage.classList.add("fade-in-top-right");
    return;
  }
  /**
   * If the page is vacant, then only fade in source image onto
   * vacant page on the LHS.
   */
  sourcePhotoImage.classList.add("fade-in-top-left");
  return;
};

export const removeAnimationClasses = (event) => {
  event.target.classList.remove("drag-start");
  // Remove the CSS classes related to animating the photo images.
  const clonedNodes = [...document.querySelectorAll("[id^='clone-']")];
  const fadesCSSStyles = [...document.querySelectorAll("[class^='fade-in-']")];
  const resizeScaleCSSStyles = [
    ...document.querySelectorAll("[class^='resize-scale-']"),
  ];

  /**
   * As animation takes half a second to run, wait an addition half second then remove
   * cloned nodes for seamless animation transition
   */
  setTimeout(() => {
    clonedNodes.forEach((node) => node.remove());
    fadesCSSStyles.forEach((node) =>
      node.classList.remove(
        "fade-in-top-left",
        "fade-in-top-right",
        "fade-in-bottom-left",
        "fade-in-bottom-right"
      )
    );
    resizeScaleCSSStyles.forEach((node) =>
      node.classList.remove(
        "resize-scale-top-left",
        "resize-scale-top-right",
        "resize-scale-bottom-left",
        "resize-scale-bottom-right"
      )
    );
  }, 1000);
};
