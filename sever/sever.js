import express from "express";
import cors from "cors";  // ✅ Import cors
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "NoteBook",
    password: "27022006",
    port: 5432,
});

await db.connect();

const app = express();
app.use(cors({ origin: "*" }));  // ✅ Cho phép tất cả origin
app.use(express.json());  // ✅ Cho phép đọc dữ liệu JSON

// 🟢 Lấy danh sách sách
app.get("/books", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy danh sách sách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Book not found" });
      }
      res.json(result.rows[0]);
  } catch (error) {
      console.error("Lỗi lấy dữ liệu sách:", error);
      res.status(500).json({ error: "Lỗi server" });
  }
});


// 🔵 Thêm sách mới
app.post("/add", async (req, res) => {
  const { title, author_name, cover_id, description } = req.body;
  try {
    await db.query(
      "INSERT INTO books (title, author_name, cover_id, description) VALUES ($1, $2, $3, $4)",
      [title, author_name, cover_id, description]
    );
    res.json({ message: "Đã thêm sách" });
  } catch (err) {
    console.error("Lỗi khi thêm sách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});


// 🔵 Cập nhật mô tả sách
app.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
      await db.query("UPDATE books SET description = $1 WHERE id = $2", [description, id]);  
      res.json({ message: "Sách đã được cập nhật!" });
    } catch (error) {
      console.error("Lỗi cập nhật sách:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
});

// 🔴 Xóa sách
app.delete("/books/:id", async(req,res) => {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM books WHERE id = $1", [id]);  
      res.json({ message: "Đã xóa sách" });
    } catch (error) {
      console.error("Lỗi xóa sách:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
});

app.listen(5000, () => console.log("🔥 Server đang chạy trên cổng 5000"));
