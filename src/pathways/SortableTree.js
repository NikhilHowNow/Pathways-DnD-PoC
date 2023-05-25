import React, { useState } from "react";
import Drag from "./Drag";
import DragAndDrop from "./DragAndDrop";
import Drop from "./Drop";
import "./styles.css";


const SortableTree = () => {
  const [categories, setCategories] = useState([
    { id: "jsiww", name: "Element 1", isSection: false },
    { id: "uernd", name: "Element 2", isSection: false },
    {
      id: "u621",
      name: "Section 1 (no child)",
      isSection: true,
      items: []
    },
    {
      id: "q101",
      name: "Section 2 (with child)",
      isSection: true,
      items: [
        { id: "abc", name: "First", isSection: false },
        { id: "def", name: "Second", isSection: false }
      ]
    }
  ]);

  const handleDragAndDropEnd = (result) => {
    console.log(result);
    const { source, destination } = result;
    const sourceCategoryId = source.droppableId;

    const sourceEle = categories[source.index];
    const destEle = categories[destination.index];
    
    if(!sourceEle.isSection && destEle.isSection){
      console.log('parent to child drop', '1');
      const clonedCategories = [...categories];
      const clonedCategory = clonedCategories.find((ele, index) => index === destination.index);
      const [ele] = clonedCategories.splice(source.index, 1);
      const clonedCategoryItems = [...clonedCategory.items];
      clonedCategoryItems.push(ele);
      clonedCategory.items = [...clonedCategoryItems];
      const copy = clonedCategories.filter(ele => ele.id !== clonedCategory.id);
      setCategories([...copy, clonedCategory]);
    } else if (source.droppableId === destination.droppableId && source.droppableId !== 'dropzone' && destination.droppableId !== 'dropzone'){
      console.log('inside section reorder', '2');
      const category = categories.find(ele => ele.id === sourceCategoryId);
      const categoryItems = category.items;
      const clonedCategoryItems = [...categoryItems];
      const [ele] = clonedCategoryItems.splice(source.index, 1);
      clonedCategoryItems.splice(destination.index, 0, ele);
      const clonedCategory = { ...category, items: clonedCategoryItems };
      const copy = categories.filter(ele => ele.id !== clonedCategory.id);
      setCategories([...copy, clonedCategory]);
    } else if(!sourceEle.isSection && !destEle.isSection){
      console.log('normal reorder', '3');
      const clonedCategories = [...categories];
      const [ele] = clonedCategories.splice(source.index, 1);
      clonedCategories.splice(destination.index, 0, ele);
      setCategories([...clonedCategories]);
    } else {
      console.log('section reorder', '4');
      const clonedCategories = [...categories];
      const [ele] = clonedCategories.splice(source.index, 1);
      clonedCategories.splice(destination.index, 0, ele);
      setCategories([...clonedCategories]);
    }

  }

  return (
    <DragAndDrop onDragEnd={handleDragAndDropEnd} onDragStart={(item) => console.log(item)}>
      <Drop id="dropzone" type="dropzone-common">
        {categories.map((category, categoryIndex) => {
          return (
            <Drag
              className="draggable-category"
              key={category.id}
              id={category.id}
              index={categoryIndex}
            >
              <div className="category-container">
                <h2 className="item">{category.name} || {category.id}</h2>

                <Drop key={category.id} id={`${category.id}`} type="droppable-item">
                  {category.items &&
                    category.items.map((item, index) => {
                      return (
                        <Drag
                          className="draggable"
                          key={item.id}
                          id={item.id}
                          index={index}
                        >
                          <div className="item">{item.name}</div>
                        </Drag>
                      );
                    })}
                </Drop>
              </div>
            </Drag>
          );
        })}
      </Drop>
    </DragAndDrop>
  );
};

export default SortableTree;
