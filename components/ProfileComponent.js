import { Fragment, useState, useEffect, useContext } from "react";
import { UserContext } from "../utils/context";
import { RiLinkedinBoxFill, RiTwitterFill, RiGithubFill } from "react-icons/ri";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  docSnap,
} from "@firebase/firestore";

import { db, auth } from "../utils/firebase";
import { useRouter } from "next/router";
import avatar from "./assets/avatar.jpg";

import { Dialog, Transition } from "@headlessui/react";
import {
  ArchiveIcon,
  ClockIcon,
  HomeIcon,
  MenuAlt2Icon,
  UserCircleIcon as UserCircleIconOutline,
  ViewListIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  BellIcon,
  CalendarIcon,
  ChatAltIcon,
  CheckCircleIcon,
  LockOpenIcon,
  PencilIcon,
  SearchIcon,
  TagIcon,
  UserCircleIcon as UserCircleIconSolid,
} from "@heroicons/react/solid";

const navigation = [
  { name: "Profile", href: "/profile", icon: HomeIcon, current: true },
  {
    name: "My Inventory",
    href: "/vehicles",
    icon: ViewListIcon,
    current: false,
  },
  {
    name: "Rent History",
    href: "/rent-history",
    icon: UserCircleIconOutline,
    current: false,
  },
  { name: "Rent Orders", href: "/orders", icon: ArchiveIcon, current: false },
];
const projects = [
  { id: 1, name: "GraphQL API", href: "#" },
  { id: 2, name: "iOS App", href: "#" },
  { id: 3, name: "Marketing Site Redesign", href: "#" },
  { id: 4, name: "Customer Portal", href: "#" },
];
const activity = [
  {
    id: 1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago",
  },
  {
    id: 2,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    date: "2d ago",
  },
  {
    id: 3,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-rose-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" },
    ],
    date: "6h ago",
  },
  {
    id: 4,
    type: "comment",
    person: { name: "Jason Meyers", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.",
    date: "2h ago",
  },
];

function ProfileComponent(props) {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const [userData, setUserData] = useState({});

  console.log("user", user);

  useEffect(() => {
    if (user) {
      const uid = auth.currentUser.uid;
      console.log("UID", uid);
      const docRef = doc(db, "users", uid);
      const docSnap = getDoc(docRef).then((doc) => {
        docSnap = doc.data();
        console.log("docSnap", docSnap);
        setUserData(docSnap);
        console.log("User Email", docSnap);
      });
    }
  }, [user]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="py-3 xl:pt-6 xl:pb-0">
      <h2 className="sr-only">Description</h2>

      <p>
        Name: {userData?.firstName} {userData?.lastName}
      </p>
      <p>Username: {userData?.username}</p>
      <p>Email: {userData?.email}</p>
      {userData?.photoURL ? (
        <img src={userData?.photoURL} className="rounded-sm h-20 w-20" />
      ) : (
        <img src={avatar} className="rounded-sm h-20 w-20" />
      )}
    </div>
  );
}

export default ProfileComponent;
