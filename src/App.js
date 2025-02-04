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

const OPENED_TABS = [];

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
    refreshSTructure(true);
    
  }

  const [openedFiles, setOpenedFiles] = useState(OPENED_TABS)
  const openThisFile = (file) => {
    let findIndex = -1;
    for(let index in OPENED_TABS){
      if (OPENED_TABS[index].name === file.name) {
        findIndex = index;
      }
      OPENED_TABS[index].isOpened = false;
    }

    file.isOpened = true;
    if (findIndex === -1) {
      OPENED_TABS.push(file);
    }


    setOpenedFiles(Array.from(OPENED_TABS));
  }

  const generateItemJSX = (data) => {
    
    return data.reduce((acc, next) => {
      acc.push(
        <li key={`${next.path}/${next.name}`} style={{marginLeft: 10 * next.level, padding: "5px"}} onClick={() => {
          if(next.type === "file") return;
          return toggleExpand(next);
        }}>
          {next.type === "folder" && <span className="material-icons material-symbols-outlined pointer-cursor">
            {next?.showChildren? "keyboard_arrow_down" : "keyboard_arrow_right"}
          </span>}
              <span onClick={() => openThisFile(next)}>{next.name}&nbsp;&nbsp;</span>
          {next.type === "folder" && <span className="add-tem" onClick={(evt) => {evt.stopPropagation(); return addItem(next)}}>+</span>}
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
      type: selectedOption,
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

  const [selectedOption, setSelectedOption] = useState("folder");
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const getOpenFileTabs = () => {
    return (
      <ul className="opened-files-ul">
        {OPENED_TABS?.map(file => {
          return <li className="current-opened-file">{file.name} <span className="close-file">x</span></li>
        })}
      </ul>
    );
  }

  return (
    <div>
      <div className="editor-header"></div>
      <div className="App flex-container">
        <ul className='explorer'>{itemJSX}</ul>
        <dialog id="myDialog">
          <h4>Add file/folder to</h4>
          <p>{currItem?.path}</p>
          <div style={{display: "flex", flexDirection: "row"}}>
              <div>
                <input 
                  type="radio" 
                  value="folder" 
                  checked={selectedOption === 'folder'} 
                  onChange={handleOptionChange} 
                />
                <label htmlFor="folder">Folder </label>
              </div>
              <div>
                <input 
                  type="radio" 
                  value="file" 
                  checked={selectedOption === 'file'} 
                  onChange={handleOptionChange} 
                />
                <label htmlFor="file">File</label>
              </div>
            </div>
          <input type="text" value={itemName} onChange={(evt) => handleCurrItem(evt.target.value)}/>
          <button onClick={addAndClose}>ADD</button>
        </dialog>

        <div className="open-files-container">
          {getOpenFileTabs()}
          {/* {getFileEditor()} */}
        </div>
    </div>
    </div>
  );
}

export default App;
