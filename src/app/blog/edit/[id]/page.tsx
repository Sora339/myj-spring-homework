"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const editBlog = async (
  title: string | undefined,
  description: string | undefined,
  id: string
) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  return res.json();
};

const getBlogById = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const data = await res.json();
  return data.post;
};

const deleteBlog = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("編集中です...", { id: "1" });

    console.log(titleRef.current?.value);
    console.log(descriptionRef.current?.value);
    await editBlog(
      titleRef.current?.value,
      descriptionRef.current?.value,
      params.id as string
    );

    toast.success("編集に成功しました", { id: "1" });

    setTimeout(() => {
      toast.remove();
      router.push("/");
      router.refresh();
    }, 500);
  };

  const hundleDelete = async (e: React.MouseEvent) => {
    toast.loading("削除中です...", {id: "2"});
    await deleteBlog(params.id as string);
    toast.success("削除に成功しました", { id: "2" });

    setTimeout(() => {
      toast.remove();
      router.push("/");
      router.refresh();
    }, 500);
  }

  useEffect(() => {
    getBlogById(params.id as string)
      .then((data) => {
        titleRef.current!.value = data.title;
        descriptionRef.current!.value = data.description;
      })
  }, []);

  return (
    <>
      <Toaster />
      <div className="w-full m-auto flex h-screen bg-blue-300">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-800 font-bold p-3">
            ブログの編集 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md bg-white px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md bg-white px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button onClick={hundleDelete} type="button" className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100">
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
