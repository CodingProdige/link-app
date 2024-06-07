import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RiDraggable } from "react-icons/ri";
import styles from '@/styles/draggableList.module.scss';
import { updateLinks } from '@/utils/firebaseUtils'; // Ensure you have the correct path

// Function to reorder the list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DraggableList = ({ items = [], userId, setItems }) => {
  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(reorderedItems);

    try {
      await updateLinks(userId, reorderedItems);
      console.log('Links updated successfully');
    } catch (error) {
      console.error('Error updating links: ', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.container}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles.draggableItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <span className={styles.dragHandle}>
                      <RiDraggable />
                    </span>

                    <div className={styles.linkDataContainer}>
                      <span id={styles.linkTitle}>{item.title}</span>
                      <span id={styles.linkUrl}>{item.link}</span>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
