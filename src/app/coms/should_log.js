import Link from "next/link";

export default function SH() {
  return (
    <main>
        you should <Link className="link" href={"/log_in"}>go to log in</Link>
        or <Link className="link" href={"/sign_up"}>sign up</Link>
    </main>
  )
}