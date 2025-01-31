import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const FILES_DATA = JSON.parse(sessionStorage.getItem("tree-data")) || [{
  node: "root",
  name: "File manager",
  type: "folder",
  showChildren: true,
  path: "/",
  level: 1,
  children:[]
}];

function App() {
  const [currItem, setCurrItem] = useState(null);
  const addItem = (item) => {
    setCurrItem(item);
    document.getElementById("myDialog").showModal();
  };

  const deleteItem = (data, nodeName) => {
    // const nodeName = pItem.name;
    // if (item.node === "root") return alert("Can not delete root node");

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
  
      if (item.node === "child" && item.name === nodeName) {
        data.splice(i, 1); // Remove the element
        // return true; // Indicate that the node was found and deleted
      }
  
      if (item.children && item.children.length > 0) {
        if (deleteItem(item.children, nodeName)) {
          // return true; // Node was found in the children
        }
      }
    }

    console.log("FILES_DATA", FILES_DATA)
    refreshSTructure(true);
  }

  const refreshSTructure = (updateStorage) => {
    updateStorage && sessionStorage.setItem("tree-data", JSON.stringify(FILES_DATA))
    setItemJSX(generateItemJSX(FILES_DATA));
  }
  
  const toggleExpand = (item) => {

    item.showChildren = !item.showChildren
    refreshSTructure(false);
    
  }

  const generateItemJSX = (data) => {
    
    return data.reduce((acc, next) => {
      acc.push(
        <li key={`${next.path}/${next.name}`} style={{marginLeft: 10 * next.level, padding: "5px"}} onClick={() => toggleExpand(next)}>
          <span className="material-icons material-symbols-outlined pointer-cursor">
            {next?.showChildren? "keyboard_arrow_down" : "keyboard_arrow_right"}
          </span>
              {next.name}&nbsp;&nbsp;
          <span className="add-tem" onClick={(evt) => {evt.stopPropagation(); return addItem(next)}}>+</span>
          &nbsp;
          <span className="add-tem" onClick={(evt) => {evt.stopPropagation(); return deleteItem(FILES_DATA, next.name)}}>x</span>
        </li>)
      return (next?.children?.length && next?.showChildren) ? acc.concat(generateItemJSX(next.children)) : acc;
    }, []);
  };

  let initialData = generateItemJSX(FILES_DATA);
  const [itemJSX, setItemJSX] = useState(initialData);
  useEffect(() => {
    setItemJSX(itemJSX);
  },[itemJSX]);

  const [itemName, setItemName] = useState("");
  const handleCurrItem = (name) => {
    setItemName(name);
  };

  const addAndClose = () => {
    let updatedCurrItem = currItem;
    updatedCurrItem.children.push({
      node: "child",
      name: itemName,
      type: "folder",
      showChildren: true,
      path: currItem.path + itemName +"/",
      level: currItem.level + 1,
      children:[]
    });

    setCurrItem(updatedCurrItem);
    setItemName("");
    document.getElementById("myDialog").close();

    refreshSTructure(true);
  }

  return (
    <div className="App">
      <ul className='explorer'>{itemJSX}</ul>
      <dialog id="myDialog">
        <h4>Add file/folder to</h4>
        <p>{currItem?.path}</p>
        <input type="text" value={itemName} onChange={(evt) => handleCurrItem(evt.target.value)}/>
        <button onClick={addAndClose}>ADD</button>
      </dialog>
    </div>
  );
}

export default App;
