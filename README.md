This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Popsa.com - React Frontend test skeleton

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

Feel free to modify the source code in anyway that you see fit.

---

# Task

To implement **Drag to swap** functionality with the aid of animations to help end users understand the behaviour of the app when dragging and dropping images on pages.

## Approach
To use Javascript's in built **Drag API** to implement the drag to swap feature. For the animations, **CSS** would be used via the Styled Component library's `keyframes` functionality to build the transitions where needed.

### Logic
On selection of a photo (or `sourcePhoto`), the app will commence tracking the location of the user's mouse as they drag the photo across their screen; using the native `clientX` and `clientY` properties, the user's location is tracked and stored into `positionOfSelectedImage` until the selected photo has been dropped.

Once the photo has been dropped, the following scenarios are considered when figuring out how to handle the dropped photo. Has the selected photo been:

- dropped onto a vacant page?
- dropped adjacent to another photo but in an empty space?
- dragged then left in it's original position?
- intersected/overlapped with another photo on a page (i.e. a swap)?

For the last scenario, the following **permutations** as to what is considered a valid swap are considered:

- swapping the selected photo for a _singular photo_ on a page.
- swapping the selected photo with the _first photo_ on a page.
- swapping the selected photo with the _last photo_ on a page.
- swapping the selected photo with photos _in between_ the first and last images.

To determine which condition to execute, the `findPhotoIntersection` method was implemented to help find the proximate element the selected photo was dropped next to using the coordinates supplied from the `positionOfSelectedImage` variable to calculate an area to search in. Whichever is detected in that area is considered the `closestPhotoElement` .

## Outcomes
The solution implements animations to hint to the user that a drag and swap action has taken place and aims to be as close to the look and feel of the animations stipulated in the task. The only animation absent from the solution is the light coloured overlay that's displayed when hovering over a prospective photo to perform the swap with. In it's current state, the app can handle basic drag and swap operations but there are code limitations when it comes to scaling the number of photo in an album to handle.

## Limitations
As mentioned earlier, there logic does have its limitations when scaling and does required further refinement of the aforementioned scenarios for the solution to scale comfortably. Furthermore, the amount of code present in the code could be significantly reduced provided that the logic is revised/refactored.

Another limitation of the solution is the accuracy of the detection when deciphering the closest photo the selected photo is being swapped for. At present, the code uses the user's mouse location to calculate which photo is proximate to a selection:
``` 
const  horizontalDetection = sourceCoords.x < x + width && sourceCoords.x + sourceCoords.width > x;
const  verticalDetection = sourceCoords.y < y + height && sourceCoords.y + sourceCoords.height > y;
````
Most of the time the correct photo swaps are executed however, the incorrect swaps can happen if the selected photo isn't 100% directly over the proximate photo to swap. 

<sup>Popsa.com</sup>