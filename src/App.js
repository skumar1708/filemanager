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
        <li key={`${next.path}/${next.name}`} style={{paddingLeft: 10 * next.level}} onClick={() => toggleExpand(next)}>
          <span className="material-icons material-symbols-outlined pointer-cursor">
            {next?.showChildren? "keyboard_arrow_down" : "keyboard_arrow_right"}
          </span>
              {next.name}
          <span className="add-tem" onClick={() => addItem(next)}>+</span>
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
      node: "root",
      name: itemName,
      type: "folder",
      showChildren: true,
      path: "/"+itemName,
      level: currItem.level + 1,
      children:[]
    });

    setCurrItem(updatedCurrItem);
    document.getElementById("myDialog").close();

    refreshSTructure(true);
  }

  return (
    <div className="App">
      <ul className='explorer'>{itemJSX}</ul>
      <dialog id="myDialog">
        <p>{currItem?.path}</p>
        <input type="text" onChange={(evt) => handleCurrItem(evt.target.value)}/>
        <button onClick={addAndClose}>ADD</button>
      </dialog>
    </div>
  );
}

export default App;
