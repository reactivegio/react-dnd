import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchangeAlt,
  faSadCry,
  faSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

function App() {
  interface ItemDraggable {
    correct: number;
    title: string;
  }

  const initialDnDState = {
    draggedFrom: -1 as number,
    draggedTo: -1 as number,
    isDragging: false as boolean,
    originalOrder: [] as ItemDraggable[],
    updatedOrder: [] as ItemDraggable[],
  };

  const items = [
    { correct: 3, title: "Oil the fish" },
    { correct: 5, title: "Serve and garnish" },
    { correct: 2, title: "Stuff for flavour" },
    { correct: 1, title: "Making the cuts" },
    { correct: 4, title: "Cooking time" },
  ];

  const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);
  const [isOrdered, setIsOrdered] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  // The initial state of "list" is going to be the static "items" array
  const [list, setList] = React.useState(items);

  /**
   * Check if items is ordered when confirm button is checked
   */
  const checkIsOrderd = () => {
    const l = list.length;
    for (let i = 1; i < l / 2 + 1; i++) {
      if (
        list[i - 1].correct > list[i].correct ||
        list[l - i].correct < list[l - i - 1].correct
      ) {
        return false;
      }
    }
    return true;
  };

  const onDragStart = (event: React.DragEvent<HTMLLIElement>) => {
    // It receives a DragEvent which inherits properties from MouseEvent and Event
    // so we can access the element through event.currentTarget

    // Later, we'll save in a hook the item being dragged

    // We'll access the "data-position" attribute of the current element dragged
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      // we spread the previous content of the hook
      // so we don't override the properties not being updated
      ...dragAndDrop,
      draggedFrom: initialPosition, // set the draggedFrom position
      isDragging: true,
      originalOrder: list, // store the current state of "list"
    });

    // Note: this is only for Firefox. Without it, the DnD won't work.
    event.dataTransfer.setData("text/html", "");
  };

  const onDragOver = (event: any) => {
    // It also receives a DragEvent. Later, we'll read the position of the item from event.currentTarget
    // and store the updated list state

    // We need to prevent the default behavior of this event, in order for the onDrop event to fire.
    // the default is to cancel out the drop.
    event.preventDefault();
    // Store the content of the original list in this variable that we'll update
    let newList = dragAndDrop.originalOrder;

    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom;

    // index of the drop area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    // get the element that's at the position of "draggedFrom"
    const itemDragged = newList[draggedFrom];

    // filter out the item being dragged
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );

    // update the list
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    // since this event fires many times
    // we check if the targets are actually different:
    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        // save the updated list state
        // we will render this onDrop
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = () => {
    // - update the rendered list
    // - reset the DnD state
    // we use the updater function for hook
    setList(dragAndDrop.updatedOrder);

    // and reset the state of the DnD
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: -1,
      draggedTo: -1,
      isDragging: false,
    });
  };

  const renderResult = (icon: IconProp, text: string) => {
    return (
      <div style={{ marginTop: "50px", fontSize: "30px" }}>
        {" "}
        <FontAwesomeIcon
          style={{ fontSize: "40px", verticalAlign: "middle" }}
          icon={icon}
        />{" "}
        {text}
      </div>
    );
  };
  return (
    <div className="App">
      <h1>How to barbecue a whole fish</h1>
      <h5>drag & drop to sort correctly</h5>
      {!isConfirmed ? (
        <section>
          <ul className="fileListContainer">
            {list.map((item, index) => {
              return (
                <li
                  className={
                    dragAndDrop && dragAndDrop.draggedTo === Number(index)
                      ? "dropArea"
                      : ""
                  }
                  data-position={index}
                  key={index}
                  draggable="true"
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                >
                  <div>
                    {dragAndDrop && dragAndDrop.draggedTo === Number(index) ? (
                      <div>
                        <FontAwesomeIcon
                          style={{ fontSize: "20px" }}
                          icon={faExchangeAlt}
                        />
                      </div>
                    ) : null}
                    {item.title}
                  </div>
                </li>
              );
            })}
          </ul>
          <div
            className="btnConfirm"
            onClick={() => {
              const checkVal: boolean = checkIsOrderd();
              setIsOrdered(checkVal);
              setIsConfirmed(true);
            }}
          >
            CONFIRM ORDER
          </div>
        </section>
      ) : isOrdered ? (
        renderResult(faSmileBeam, "Congratulation this is the correct order!!")
      ) : (
            renderResult(faSadCry, "The order is wrong!")
          )}
    </div>
  );
}

export default App;
