"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

async function postBlog(title: string | undefined, description: string | undefined) {
    const res = await fetch(`http://localhost:3000/api/blog`, {
        method: "POST",
        headers: {
            "Content-Type": "applcation/json",
        },
        body: JSON.stringify({title,description}),
    })
    const data = await res.json();
  
    return data.posts;

}

export default function Page() {
    const router =  useRouter()
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

    const hundleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("投稿中です...", {id: "0"})

        console.log(titleRef.current?.value);
        console.log(descriptionRef.current?.value);
        await postBlog(titleRef.current?.value, descriptionRef.current?.value)

        toast.success("投稿に成功しました", {id: "0"})

        router.push("/");
        router.refresh();

        setTimeout(() => {
            toast.remove();
          }, 1000);
    }
  return (
    <>
    <Toaster />
      <div className="w-full m-auto flex bg-blue-300 h-screen">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-800 font-bold p-3">
            ブログ新規作成 🚀
          </p>
          <form onSubmit={hundleSubmit}>
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
              投稿
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
