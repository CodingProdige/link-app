import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RiDraggable } from "react-icons/ri";
import styles from '@/styles/draggableList.module.scss';
import { updateLinks, updateLinkActiveState } from '@/utils/firebaseUtils'; // Ensure you have the correct path

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

    // Update the ids to match their new index in the array
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      id: index + 1, // Assuming ids are 1-based
    }));

    setItems(updatedItems);

    try {
      await updateLinks(userId, updatedItems);
      console.log('Links updated successfully');
    } catch (error) {
      console.error('Error updating links: ', error);
    }
  };

  const toggleActive = async (itemId, currentState) => {
    try {
      const updatedItems = await updateLinkActiveState(userId, itemId, !currentState);
      setItems(updatedItems);
      console.log(`Updated link ${itemId} active state to ${!currentState}`);
      console.log(updatedItems);
    } catch (error) {
      console.error('Error updating link active state: ', error);
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

                    <div className={styles.dataContainer}>
                      <div className={styles.linkDataContainer}>
                        <span id={styles.linkTitle}>{item.title}</span>
                        <span id={styles.linkUrl}>{item.link}</span>
                      </div>

                      <div className={styles.dataFunctions}>
                        <button className={styles.editButton}>Edit</button>
                        <button className={styles.copyButton}>Copy</button>
                        <button className={styles.deleteButton}>Delete</button>
                      </div>
                    </div>

                    <div className={styles.toggleContainer}>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={item.active} 
                          onChange={() => toggleActive(item.id, item.active)} 
                        />
                        <span className={styles.slider}></span>
                      </label>
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
