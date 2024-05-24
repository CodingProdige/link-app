import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiMove } from 'react-icons/fi';

// Function to reorder the list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DraggableList = ({ items = [] }) => {
  const [state, setState] = useState(items);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      state,
      result.source.index,
      result.destination.index
    );

    setState(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ padding: 20, background: '#f8f9fa', borderRadius: 4 }}
          >
            {state.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      userSelect: 'none',
                      padding: 16,
                      margin: '0 0 8px 0',
                      minHeight: '50px',
                      backgroundColor: '#fff',
                      color: '#333',
                      border: '1px solid lightgrey',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ...provided.draggableProps.style,
                    }}
                  >
                    <span>{item.content}</span>
                    <span
                      {...provided.dragHandleProps}
                      style={{ cursor: 'grab' }}
                    >
                      <FiMove />
                    </span>
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
