import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useActionData } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate , useLocation} from "react-router-dom";



// Footer component
function Footer() {
  return (
    <div>
      <footer className="text-white p-4 m-8 text-center">
        Copyright© {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function DeleteItems({setDeleteBoard,index,setNotebooks,setRefreshData}) {
    function HandleCancle() {
      setDeleteBoard((pre)=>({...pre,[index]: false}));
    }

  async function HandleAgree() {
    try {
    await axios.delete(`http://localhost:5000/books/${index}`);
    setRefreshData(true);
    } catch (error) {
    console.error("Xóa thất bại", error);
    } finally {
       HandleCancle();
       
    }
  }

    return <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-white">
      <div className="bg-white p-4 w-[100px] h-[100px] flex flex-col items-center justify-center">
      <p className="text-sm font-semibold">Xóa?</p>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={HandleAgree}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button 
            onClick={HandleCancle}
            className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
 }
// List component
function List({ notebooks, setNotebooks, setRefreshData}) {
  const [DeleteBoard,setDeleteBoard] = useState({});
 
  return (
    
    <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Bookuta</h1>
      {notebooks.map((notebook, index) => ( 
        <div className="grid grid-rows-[20px_auto] bg-white shadow-lg rounded-lg p-4 hover:shadow-2xl">

          <div className="flex justify-end items-start">
            <button 
            className="bg-transparent hover:bg-red-500 text-gray-700 hover:text-white p-2 rounded-full transition"
            onClick={()=>setDeleteBoard((pre)=>({...pre,[notebook.id]:true}))}
            > 
            <DeleteIcon/> 
            </button>
            {DeleteBoard[notebook.id]&&<DeleteItems setDeleteBoard={setDeleteBoard} index={notebook.id} setNotebooks={setNotebooks} setRefreshData={setRefreshData}/>}
          </div>
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          <div className="flex justify-center">
            <img
              src={notebook.cover_id?`https://covers.openlibrary.org/b/id/${notebook.cover_id}-M.jpg`:"https://via.placeholder.com/200"}
              alt={notebook.title}
              className="w-[200px] max-w-xs md:max-w-sm lg:max-w-md rounded-md border border-gray-300 object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{notebook.title}</h2>
            <p className="text-gray-600 line-clamp-5">
              {notebook.description}
            </p>
            <Link to={`/book/${notebook.id}`} className="text-gray-500">
              ....more
            </Link>
          </div>
        </div>
        </div>
      ))}
    </div>
  );
}

function AddComponent({ setShowInputs, index, book }) {
  const [content, setContent] = useState(book.description || "");

  function handleToggleCancel() {
    setShowInputs((prev) => {
      const newShowInputs = [...prev];
      newShowInputs[index] = false;
      return newShowInputs;
    });
  }

  async function handleSave() {
    try {
      await axios.post("http://localhost:5000/add", {
        title: book.title,
        author_name: book.author_name || "Không rõ",
        cover_id: book.cover_i || null,
        description: content,
      });
      console.log("Đã lưu mô tả:", content);
      handleToggleCancel();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  }

  return (
    <div>
      <div className="mt-4">
      <textarea
        className="w-full border p-2 rounded h-full"
        rows="6"
        placeholder="Nhập mô tả..."
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
      <div className="flex justify-between pt-2 pb-2">
        <button
          onClick={handleToggleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-[100px]"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-[100px]"
        >
          Lưu
        </button>
      </div>
    </div>
    </div>
    
  );
}


function SearchBar({ setBooks }) {
  const [bookName, setBookName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hold, setHold] = useState("Nhập tên sách...");
  const navigate = useNavigate();

  function handleInputChange(event) {
    setBookName(event.target.value);
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`https://openlibrary.org/search.json?title=${bookName}`);
      setBooks(response.data.docs);
      navigate(`/search?query=${bookName}`);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu sách:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="flex justify-end gap-0">
        <input
          type="text"
          placeholder={hold}  // ✅ Placeholder thay đổi đúng
          value={bookName}
          onChange={handleInputChange}
          className="border p-2 w-64 rounded-l-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-full">
          {loading ? "Đang tìm..." : "Tìm Kiếm"} {/* ✅ Hiển thị trạng thái nút */}
        </button>
      </form>
    </div>
  );
}



function ResultSearch({ books, setBooks, loading }) { 
  const local = useLocation();
  const queryParams = new URLSearchParams(local.search);
  const bookName = queryParams.get("query");
  useEffect(()=>{
    if(bookName && books.length === 0) {
      axios.get(`https://openlibrary.org/search.json?title=${bookName}`)
      .then((res)=>setBooks(res.data.docs))
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu sách:", error);
      })
    }
  });
  const [showInputs, setShowInputs] = useState(Array(books.length).fill(false));
  function handleToggle(index) {
    const newShowInputs = [...showInputs];
    newShowInputs[index] = !newShowInputs[index];
    setShowInputs(newShowInputs);
  }
  return (
    <div>
      {!loading && books?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-4">
          {books.map((notebook, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg p-4 gap-4 hover:shadow-2xl"
            >
              <div className="flex justify-center">
                <img
                  src={notebook.cover_i  ? `https://covers.openlibrary.org/b/id/${notebook.cover_i}-M.jpg` : "https://via.placeholder.com/200"} 
                  alt={notebook.title}
                  className="w-[200px] max-w-xs md:max-w-sm lg:max-w-md rounded-md border border-gray-300 object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">{notebook.title}</h2>
                <ul>
                  <li>Tác giả: {notebook.author_name?.join(", ") || "Không có thông tin"}</li>
                  <li>Mã bìa: {notebook.cover_i || "Không có thông tin"}</li>
                </ul>
                <div className="flex justify-end items-end w-full h-full ">
                {!showInputs[index]&&<button className="hover:text-gray-800 transition" onClick={()=>{handleToggle(index)}}>Add</button>}        
              </div>
              {showInputs[index] && <AddComponent setShowInputs={setShowInputs} index = {index} showInputs={showInputs} book={notebook}/>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">Không có kết quả.</p>
      )}
    </div>
  );
}

function HandleEdit({setValidEdit,index,setBook,Description}) {
  const [edit,setEdit] = useState(Description||"");
  function handleToggleCancel() {
    setValidEdit(false);
  }

  async function handleSave() {
    try {
      await axios.put(`http://localhost:5000/books/${index}`, {
        description: edit
      });
      console.log("Đã lưu mô tả:", edit);
      setBook(prev => ({ ...prev, description: edit }));
      handleToggleCancel();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  }
  return (
    <div>
      <div className="mt-4">
      <textarea
        className="w-full border p-2 rounded h-full"
        rows="6"
        placeholder="Nhập mô tả..."
        onChange={(e) => setEdit(e.target.value)}
        value={edit}
      />
      <div className="flex justify-between pt-2 pb-2">
        <button
          onClick={handleToggleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-[100px]"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-[100px]"
        >
          Lưu
        </button>
      </div>
    </div>
    </div>
  );
}

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Thêm trạng thái loading
  
  const [ValidEdit,setValidEdit] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/books/${id}`)
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Lỗi khi lấy dữ liệu sách");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chi tiết Sách</h2>

      {/* 🔴 Hiển thị lỗi nếu có */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🔵 Hiển thị loading */}
      {loading && <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>}

      {/* 🟢 Hiển thị chi tiết sách nếu có dữ liệu */}
      {book && (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg p-4 gap-4">
          {/* Ảnh sách */}
          <div className="flex justify-center">
            <img
              src={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : "https://via.placeholder.com/200"} // ✅ Kiểm tra nếu không có ảnh
              className="w-[200px] max-w-xs md:max-w-sm lg:max-w-md rounded-md border border-gray-300 object-cover"
              alt={book.title}
            />
          </div>

          {/* Thông tin sách */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{book.title}</h2>
            <ul>
              <li><strong>Tác giả:</strong> {book.author_name || "Không có thông tin"}</li>
              <li><strong>Mã bìa:</strong> {book.cover_id || "Không có thông tin"}</li>
              <li><strong>Mô tả:</strong> {book.description || "Không có mô tả"}  </li>
              
            </ul>
            <div className="flex justify-end items-end h-full w-full">
                  {!ValidEdit&&<button onClick = {()=>{setValidEdit(true)}} className="bg-blue-600 p-2 text-white rounded-lg flex items-center gap-1">Edit <EditIcon /></button>}
            </div>
            {ValidEdit&&<HandleEdit setValidEdit = {setValidEdit} index={book.id} setBook={setBook} Description={book.description}/>}
          </div>
        </div>
      )}
    </div>
  );
}

// App component
function App() {
  const [refreshData,setRefreshData] = useState(false);
  const [books, setBooks] = useState(()=>{
    const saveBook = localStorage.getItem("searchResults");
    return saveBook?JSON.parse(saveBook):[];
  });

  localStorage.setItem("searchResults", JSON.stringify(books));
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/books"); 
        setNotebooks(response.data); 
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      }
    }
    fetchData();
  }, [refreshData]);

  useEffect(() => {
    if (refreshData) {
      axios.get("http://localhost:5000/books")
        .then((res) => {
          setBooks(res.data);
          setRefreshData(false);
        })
        .catch((err) => console.error("Lỗi khi tải lại dữ liệu:", err));
    }
  }, [refreshData]);
  
  

  return (
      <div className="min-h-screen p-8">
        <span className="flex justify-between w-full items-center gap-4">
          <Link 
          to="/" 
          className="rounded-full bg-blue-500 text-white px-4 py-2"
          onClick={() => {
            setRefreshData(true);
            navigate("/"); 
          }}
          >Home</Link>
          <SearchBar setBooks={setBooks}/>
        </span>
        
        <Routes>
          <Route path="/search" element={<ResultSearch books={books}/>}/>
          <Route path="/" element={<List notebooks={notebooks} setNotebooks={setNotebooks} setRefreshData={setRefreshData}/>} />
          <Route
            path="/book/:id"
            element={<BookDetail notebooks={notebooks} />}
          />
        </Routes>
        <Footer />
      </div>
  );
}

export default App;
