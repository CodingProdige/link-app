"use client";
import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RiDraggable } from "react-icons/ri";
import styles from '@/styles/draggableList.module.scss';
import { updateLinks, updateLinkActiveState, updateLinkData, deleteLinkById, validateUrl, uploadImage } from '@/utils/firebaseUtils'; // Ensure you have the correct path
import Image from 'next/image';
import * as FaIcons from 'react-icons/fa'; // Import all FontAwesome icons
import { IconContext } from 'react-icons';

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
  const [showModal, setShowModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

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
  
      // Validate and sanitize metadata
      const sanitizedMetadata = {};
      for (const key in data.metadata) {
        if (data.metadata[key] !== undefined) {
          sanitizedMetadata[key] = data.metadata[key];
        }
      }
  
      if (sanitizedMetadata["og:image"]) {
        const imageUrl = sanitizedMetadata["og:image"];
        const image = await downloadAndUploadImage(userId, imageUrl);
        sanitizedMetadata["og:image"] = image;
      } else {
        sanitizedMetadata["og:image"] = null;
      }
  
      const updatedItems = [...items];
      updatedItems[index].metadata = sanitizedMetadata;
      updatedItems[index].title = sanitizedMetadata["og:title"] || '';
      updatedItems[index].image = sanitizedMetadata["og:image"] || '';
      updatedItems[index].layout = 'classic';
      updatedItems[index].linkType = 'external';
      updatedItems[index].link = sanitizedMetadata["og:url"] ? sanitizedMetadata["og:url"] : url;
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

  const handleLayoutOptionClick = async (option, index) => {
    try {
      setLoading(true);
      const updatedItems = [...items];
      updatedItems[index].layout = option;
      // updatedItems[index].linkType = 'external';

      await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
      setItems(updatedItems);
      console.log('Link layout updated successfully');
    } catch (error) {
      setError('Failed to update link layout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoOptionClick = async (option, index) => {
    try {
      setLoading(true);
      const updatedItems = [...items];
      updatedItems[index].linkType = option;
      // updatedItems[index].linkType = 'external';

      await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
      setItems(updatedItems);
      console.log('link Type updated successfully');
    } catch (error) {
      setError('Failed to update link type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMusicOptionClick = async (option, index) => {
    try {
      setLoading(true);
      const updatedItems = [...items];
      updatedItems[index].linkType = option;
      // updatedItems[index].linkType = 'external';

      await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
      setItems(updatedItems);
      console.log('link Type updated successfully');
    } catch (error) {
      setError('Failed to update link type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        alert('Error: The selected file is not an image.');
        return;
      }
  
      try {
        setLoading(true);
        const imageStorageUrl = await uploadImage(userId, file);
        console.log('Uploaded image URL:', imageStorageUrl);
  
        const updatedItems = [...items];
        updatedItems[index].metadata.metadata["og:image"] = imageStorageUrl;
        updatedItems[index].metadata.metadata["og:icon"] = null;
  
        await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
        setItems(updatedItems);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
        setShowModal(false);
      }
    }
  };

  const handleRemoveThumbnail = async (index) => {
    try {
      setLoading(true);
      const updatedItems = [...items];
      updatedItems[index].metadata.metadata["og:image"] = null;
      updatedItems[index].metadata.metadata["og:icon"] = null;

      await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
      setItems(updatedItems);
    } catch (error) {
      console.error('Error removing thumbnail:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleIconSelect = async (icon, index) => {
    try {
      setLoading(true);
      setSelectedIcon(icon);
      console.log('Selected icon:', icon);
      const updatedItems = [...items];
      updatedItems[index].metadata.metadata["og:image"] = null;
      updatedItems[index].metadata.metadata["og:icon"] = icon;

      await updateLinks(userId, updatedItems); // Update the Firestore links array after fetching metadata
      setItems(updatedItems);
      setShowModal(false); // Close modal after upload
    } catch (error) {
      console.error('Error selecting icon:', error);
    } finally {
      setLoading(false);
      setShowModal(false);
      setShowIconPicker(false)
    }
  };

  const filteredIcons = Object.keys(FaIcons).filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thumbnailButtonLabel = (imageUrl, iconName) => {
    if (imageUrl) {
      return 'Change Thumbnail';
    } else if (iconName) {
      return 'Change Icon';
    } else {
      return 'Add Thumbnail';
    }
  }

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
                                <p>{item.title ? item.title : "Title"}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
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
                                <p>{item.link ? item.link : "Link"}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
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
                          {
                            !item?.metadata?.mediaType?.includes('video') && !item?.metadata?.mediaType?.includes('music') && (
                            <svg
                              className={`
                                ${activeFunction === 'layout' && activeIndex === index ? styles.functionActive : ''}
                              `}
                              onClick={() => handleFunctionToggle('layout', index)}
                              xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-columns-gap" viewBox="0 0 16 16"
                            >
                              <path d="M6 1v3H1V1zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm14 12v3h-5v-3zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM6 8v7H1V8zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm14-6v7h-5V1zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"/>
                            </svg>
                            ) 
                          }

                          {item?.metadata?.mediaType?.includes('video') && (
                            <svg
                              className={`
                                ${activeFunction === 'video' && activeIndex === index ? styles.functionActive : ''}
                              `}                              
                              onClick={() => handleFunctionToggle('video', index)}
                              xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16"
                            >
                              <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                            </svg>
                          )}

                          {item?.metadata?.mediaType?.includes('music') && (
                            <svg 
                            className={`
                              ${activeFunction === 'music' && activeIndex === index ? styles.functionActive : ''}
                            `}                              
                            onClick={() => handleFunctionToggle('music', index)}
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16"
                          >
                            <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                            <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                            <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
                            </svg>
                          )}

                          <svg
                            className={`
                              ${activeFunction === 'image' && activeIndex === index ? styles.functionActive : ''}
                            `}
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
                        {functionPanelOpen && activeFunction === 'layout' && activeIndex === index && (
                          <div className={styles.layoutPanel}>
                            <div className={styles.closeFunctionPanel}>
                              <p className={styles.closeFunctionPanelText}>Layout Options</p>
                              <svg 
                                onClick={() => {
                                  setFunctionPanelOpen(false)
                                  setActiveFunction('');
                                  setActiveIndex(null);
                                }}
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                              </svg>
                            </div>
                            <div className={styles.layoutText}>
                              <p>Choose a layout for your link</p>
                              <div 
                                className={`${styles.layoutCheckboxContainer} ${item.layout == 'classic' ? styles.selected : ''}`} 
                                onClick={() => handleLayoutOptionClick('classic', index)}
                              >
                                <input 
                                  type="checkbox" 
                                  id="classic" 
                                  name="classic" 
                                  value="classic" 
                                  checked={item.layout === 'classic'} 
                                  readOnly
                                />
                                <div className={styles.layoutOptionsText}>
                                  <div className={styles.layoutOptionsTextInner}>
                                    <Image src="https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2FClassic.png?alt=media&token=12b5c3ee-ccca-4a72-92a2-981b2bdae1a4" alt="Classic Layout" width={200} height={200} />
                                    <div className={styles.layoutOptionsTextContainer}>
                                      <p>Classic</p>
                                      <p>Efficient, direct and compact.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div 
                                className={`${styles.layoutCheckboxContainer} ${item.layout === 'featured' ? styles.selected : ''}`} 
                                onClick={() => handleLayoutOptionClick('featured', index)}
                              >
                                <input 
                                  type="checkbox" 
                                  id="featured" 
                                  name="featured" 
                                  value="featured" 
                                  checked={item.layout === 'featured'} 
                                  readOnly
                                />
                                <div className={styles.layoutOptionsText}>
                                  <div className={styles.layoutOptionsTextInner}>
                                    <Image src="https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2FFeatured.png?alt=media&token=c4ca60e2-6026-46c3-96fd-9be4f1f7975c" alt="Featured Layout" width={200} height={200} />
                                    <div className={styles.layoutOptionsTextContainer}>
                                      <p>Featured</p>
                                      <p>Make your link stand out with a larger, more attractive display.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {functionPanelOpen && activeFunction === 'video' && activeIndex === index && (
                          <div className={styles.videoPanel}>
                            <div className={styles.closeFunctionPanel}>
                              <p className={styles.closeFunctionPanelText}>Video Options</p>
                              <svg 
                                onClick={() => {
                                  setFunctionPanelOpen(false)
                                  setActiveFunction('');
                                  setActiveIndex(null);
                                }}
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                              </svg>
                            </div>
                            <div className={styles.videoText}>
                              <p>Choose a video option for your link</p>
                              <div 
                                className={`${styles.videoCheckboxContainer} ${item.linkType === 'external' ? styles.selected : ''}`} 
                                onClick={() => handleVideoOptionClick('external', index)}
                              >
                                <input 
                                  type="checkbox" 
                                  id="external" 
                                  name="external" 
                                  value="external" 
                                  checked={item.linkType === 'external'} 
                                  readOnly
                                  className={styles.checkbox}
                                />
                                <div className={styles.videoOptionsText}>
                                  <p>External Link</p>
                                  <p>Direct your audience to the video link.</p>
                                </div>
                              </div>

                              <div 
                                className={`${styles.videoCheckboxContainer} ${item.linkType === 'embed' ? styles.selected : ''}`} 
                                onClick={() => handleVideoOptionClick('embed', index)}
                              >
                                <input 
                                  type="checkbox" 
                                  id="embed" 
                                  name="embed" 
                                  value="embed" 
                                  checked={item.linkType === 'embed'} 
                                  readOnly
                                  className={styles.checkbox}
                                />
                                <div className={styles.videoOptionsText}>
                                  <p>Embed Video</p>
                                  <p>Play the video directly on your Fanslink page.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {functionPanelOpen && activeFunction === 'image' && activeIndex === index && (
                          <div className={styles.imagePanel}>
                            <div className={styles.closeFunctionPanel}>
                              <p className={styles.closeFunctionPanelText}>Image Options</p>
                              <svg 
                                onClick={() => {
                                  setFunctionPanelOpen(false)
                                  setActiveFunction('');
                                  setActiveIndex(null);
                                }}
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                              </svg>
                            </div>
                            <div className={styles.imageFunctionContent}>
                              {item?.metadata?.metadata["og:icon"] ? (
                                <div className={styles.selectedIcon}>
                                  <IconContext.Provider value={{ size: '32px' }}>
                                    {React.createElement(FaIcons[item?.metadata?.metadata["og:icon"]])}
                                  </IconContext.Provider>
                                </div>
                              ) : (
                                <>
                                  {item?.metadata?.metadata["og:image"] && (
                                    <div className={styles.selectedImage} style={ item?.metadata?.metadata["og:image"] && {backgroundImage: `url("${item?.metadata?.metadata["og:image"]}")`}}></div>
                                  )}
                                </>
                              )}
                              <div className={styles.imageText}>
                                {
                                  !item?.metadata?.metadata["og:image"] && !item?.metadata?.metadata["og:icon"] && <p>Add a thumbnail or icon to your link.</p>
                                }
                                <div className={styles.imageButtons}>
                                  <button onClick={() => setShowModal(true)}>
                                    {thumbnailButtonLabel(item?.metadata?.metadata["og:image"], item?.metadata?.metadata["og:icon"])}
                                  </button>
                                  <button onClick={() => handleRemoveThumbnail(index)}>Remove</button>
                                </div>
                              </div>
                            </div>

                            {showModal && (
                              <div className={styles.modalOverlay}>
                                <div className={styles.modal}>
                                  <div className={styles.modalHeader}>
                                    <p>Add a thumbnail or icon</p>
                                    <svg 
                                      onClick={() => setShowModal(false)}
                                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"
                                    >
                                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                    </svg>
                                  </div>
                                  <div className={styles.modalBody}>
                                    {!showIconPicker ? (
                                      <div className={styles.mediaOptionsContainer}>
                                        <input 
                                          type="file" 
                                          ref={fileInputRef} 
                                          style={{ display: 'none' }} 
                                          onChange={(e) => handleFileChange(e, index)} 
                                        />
                                        <div className={styles.mediaOptionsButtons}>
                                          {loading ? (
                                            <button onClick={() => fileInputRef.current.click()}>Uploading...</button>
                                          ) : (
                                            <button onClick={() => fileInputRef.current.click()}>Upload Image</button>
                                          )}
                                          <button onClick={() => setShowIconPicker(true)}>Select an Icon</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={styles.iconSelectContainer}>
                                        <div className={styles.iconSelectHeader}>
                                          <svg 
                                            onClick={() => setShowIconPicker(false)}
                                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"
                                          >
                                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                                          </svg>
                                          <p>Select an Icon</p>
                                        </div>
                                      
                                        <input 
                                          type="text" 
                                          placeholder="Search icons..." 
                                          value={searchTerm} 
                                          onChange={(e) => setSearchTerm(e.target.value)} 
                                        />
                                        <div className={styles.iconGrid}>
                                          <IconContext.Provider value={{ size: "32px" }}>
                                            {filteredIcons.map(iconName => {
                                              const IconComponent = FaIcons[iconName];
                                              return (
                                                <div 
                                                  key={iconName} 
                                                  className={styles.iconOption} 
                                                  onClick={() => handleIconSelect(iconName, index)}
                                                >
                                                  <IconComponent />
                                                </div>
                                              );
                                            })}
                                          </IconContext.Provider>
                                        </div>
                                        <button onClick={() => setShowIconPicker(false)}>Back</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {functionPanelOpen && activeFunction === 'music' && activeIndex === index && (
                          <div className={styles.musicPanel}>
                            <div className={styles.closeFunctionPanel}>
                              <p className={styles.closeFunctionPanelText}>Music Options</p>
                              <svg 
                                onClick={() => {
                                  setFunctionPanelOpen(false)
                                  setActiveFunction('');
                                  setActiveIndex(null);
                                }}
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16"
                              >
                                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                                <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
                              </svg>
                            </div>
                            <div className={styles.musicText}>
                              <p>Music options</p>
                              <div 
                                className={`${styles.musicCheckboxContainer} ${item.linkType === 'external' ? styles.selected : ''}`} 
                                onClick={() => handleMusicOptionClick('external', index)}
                              >
                                <input 
                                  type="checkbox" 
                                  id="external" 
                                  name="external" 
                                  value="external" 
                                  checked={item.linkType === 'external'} 
                                  readOnly
                                  className={styles.checkbox}
                                />
                                <div className={styles.musicOptionsText}>
                                  <p>External Link</p>
                                  <p>Direct your audience to the music link.</p>
                                </div>
                              </div>

                              <div 
                                className={`${styles.musicCheckboxContainer} ${item.linkType === 'embed' ? styles.selected : ''}`} 
                                onClick={() => handleMusicOptionClick('embed', index)}
                              >
                                <input 
                                  type="checkbox" 
                                  id="embed" 
                                  name="embed" 
                                  value="embed" 
                                  checked={item.linkType === 'embed'} 
                                  readOnly
                                  className={styles.checkbox}
                                />
                                <div className={styles.musicOptionsText}>
                                  <p>Embed Track</p>
                                  <p>Play the track directly on your Fanslink page.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {functionPanelOpen && activeFunction === 'delete' && activeIndex === index && (
                          <div className={styles.deletePanel}>
                            <div className={styles.closeFunctionPanel}>
                              <p className={styles.closeFunctionPanelText}>Delete</p>
                              <svg 
                                onClick={() => {
                                  setFunctionPanelOpen(false);
                                  setActiveFunction('');
                                  setActiveIndex(null);
                                }}
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                              </svg>
                            </div>
                            <div className={styles.deleteText}>
                              <h4>Confirm Delete</h4>
                              <p>Are you sure you want to delete this link?</p>
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
