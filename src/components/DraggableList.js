"use client";
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RiDraggable } from "react-icons/ri";
import styles from '@/styles/draggableList.module.scss';
import { updateLinks, updateLinkActiveState, updateLinkData, deleteLinkById, validateUrl} from '@/utils/firebaseUtils'; // Ensure you have the correct path

// Function to reorder the list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const downloadAndUploadImage = async (userId, imageUrl) => {
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, userId }),
    });
    const data = await res.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};

const DraggableList = ({ items = [], userId, setItems }) => {
  const [activeFunction, setActiveFunction] = useState(null);
  const [functionPanelOpen, setFunctionPanelOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [focusStyle, setFocusStyle] = useState({});
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

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
      await updateLinks(userId, updatedItems); // Update the Firestore links array after toggling active state
    } catch (error) {
      console.error('Error updating link active state: ', error);
    }
  };

  const handleFunctionToggle = (functionName, index) => {
    if (activeFunction === functionName && activeIndex === index) {
      // Case when both function and index are the same
      setFunctionPanelOpen((panelOpenValue) => !panelOpenValue);
      setActiveFunction('');
      setActiveIndex(null);
    } else {
      // Case when either function or index are different
      setActiveFunction(functionName);
      setActiveIndex(index);
      setFunctionPanelOpen(true); // Open panel by default when switching function or index
    }
  };

  const handleDeleteLink = async (itemId) => {
    try {
      setLoading(true);
      const updatedItems = await deleteLinkById(userId, itemId);
      setItems(updatedItems);
      console.log(`Link ${itemId} deleted successfully`);
      await updateLinks(userId, updatedItems); // Update the Firestore links array after deletion
    } catch (error) {
      console.error('Error deleting link: ', error);
    } finally {
      setFunctionPanelOpen(false);
      setActiveFunction('');
      setActiveIndex(null);
      setLoading(false);
    }
  };

  const startEditing = (index, field) => {
    setEditingIndex(index);
    setEditingField(field);
    setCurrentValue(items[index][field]); // Initialize the local state with the current value
  };

  const handleChange = (e) => {
    setCurrentValue(e.target.value); // Update local state, not the items array
  };

  const handleFetchMetadata = async (url, index) => {
    if (!validateUrl(url)) {
      setError('Invalid URL format');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/media-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
  
      if (data?.metadata["og:image"]) {
        const imageUrl = data.metadata["og:image"];
        const image = await downloadAndUploadImage(userId, imageUrl);
        data.metadata["og:image"] = image;
      } else {
        data.metadata["og:image"] = null;
      }
  
      const updatedItems = [...items];
      updatedItems[index].metadata = data;
      if (data?.metadata["og:title"]) {
        updatedItems[index].title = data?.metadata["og:title"];
      }
      if (data?.metadata["og:image"]) {
        updatedItems[index].image = data?.metadata["og:image"];
      }
      updatedItems[index].link = url;
      setItems(updatedItems);
  
      await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
      console.log('Link and metadata updated successfully');
    } catch (error) {
      setError('Failed to fetch media type. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const stopEditing = async (index, field) => {
    setLoading(true);
    try {
      if (currentValue !== items[index][field]) {
        const updatedItems = [...items];
        updatedItems[index][field] = currentValue; // Update the item in the array with the new value
        setItems(updatedItems); // Update the items state

        if (field === 'link') {
          await handleFetchMetadata(currentValue, index);
        } else {
          await updateLinks(userId, updatedItems); // Update the Firestore links array after editing
          console.log(`${field} updated successfully for link ${items[index].id}`);
        }
      } else {
        return;
      }
    } catch (error) {
      console.error(`Error updating ${field}: `, error);
    } finally {
      setEditingIndex(null);
      setEditingField(null);
      setLoading(false);
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
                    <div className={styles.controlsContainer}>
                      <span className={styles.dragHandle}>
                        <RiDraggable />
                      </span>

                      <div className={styles.dataContainer}>
                        <div className={styles.linkDataWrapper}>
                          <div className={styles.linkDataContainer}>
                            {editingIndex === index && editingField === 'title' ? (
                              <input
                                style={focusStyle}
                                onFocus={() => setFocusStyle({
                                  border: 'none',
                                  padding: '0',
                                  width: '100%',
                                  backgroundColor: 'transparent',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  borderRadius: '0',
                                  lineHeight: '1.5rem',
                                  fontWeight: '700',
                                })}
                                value={currentValue}
                                onChange={handleChange}
                                onBlur={() => stopEditing(index, 'title')}
                                autoFocus
                              />
                            ) : (
                              <span className={styles.linkTitle} onClick={() => startEditing(index, 'title')}>
                                <p>{item.title}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                              </span>
                            )}
                            {editingIndex === index && editingField === 'link' ? (
                              <input
                                style={focusStyle}
                                onFocus={() => setFocusStyle({
                                  border: 'none',
                                  padding: '0',
                                  width: '100%',
                                  backgroundColor: 'transparent',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  borderRadius: '0',
                                  lineHeight: '1.5rem',
                                  fontWeight: '400',
                                })}
                                value={currentValue}
                                onChange={handleChange}
                                onBlur={() => stopEditing(index, 'link')}
                                autoFocus
                              />
                            ) : (
                              <span className={styles.linkUrl} onClick={() => startEditing(index, 'link')}>
                                <p>{item.link}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                              </span>
                            )}
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

                        <div className={styles.dataFunctions}>
                          <svg
                            className={activeFunction === 'video' && activeIndex === index ? styles.functionActive : ''}
                            onClick={() => handleFunctionToggle('video', index)}
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16"
                          >
                            <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                          </svg>

                          <svg
                            className={activeFunction === 'image' && activeIndex === index ? styles.functionActive : ''}
                            onClick={() => handleFunctionToggle('image', index)}
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16"
                          >
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
                          </svg>

                          <svg
                            className={activeFunction === 'delete' && activeIndex === index ? styles.functionActive : ''}
                            onClick={() => handleFunctionToggle('delete', index)}
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                          </svg>
                        </div>
                      </div>

                    </div>

                    {functionPanelOpen && activeIndex === index && (
                      <div className={styles.functionalityContainer}>
                        {functionPanelOpen && activeFunction === 'video' && activeIndex === index && (
                          <div className={styles.videoPanel}>
                            <h3>Video Panel</h3>
                          </div>
                        )}

                        {functionPanelOpen && activeFunction === 'image' && activeIndex === index && (
                          <div className={styles.imagePanel}>
                            <h3>Image Panel</h3>
                          </div>
                        )}

                        {functionPanelOpen && activeFunction === 'delete' && activeIndex === index && (
                          <div className={styles.deletePanel}>
                            <div className={styles.deleteText}>
                              <h3>Confirm Delete</h3>
                            </div>
                            <div className={styles.deleteButton}>
                              {loading ? (
                                <button disabled>Deleting...</button>
                              ) : (
                                <button onClick={() => handleDeleteLink(item.id)}>Confirm</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
