import { useState } from "react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [allRead, setAllRead] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "notif1",
      link: "/profile/1",
      time: "3",
      description: "Baga accepted your friend request",
    },
    {
      id: 2,
      title: "notif2",
      link: "/profile/2",
      time: "3",
      description: "Baga accepted your friend request",
    },
    {
      id: 3,
      title: "notif3",
      link: "/profile/3",
      time: "3",
      description: "Baga accepted your friend request",
    },
    {
      id: 4,
      title: "notif4",
      link: "/profile/4",
      time: "3",
      description: "Baga accepted your friend request",
    },
    {
      id: 5,
      title: "notif5",
      link: "/profile/5",
      time: "3",
      description: "Baga accepted your friend request",
    },
    {
      id: 6,
      title: "notif6",
      link: "/profile/6",
      time: "3",
      description: "Baga accepted your friend request",
    },
  ];

  return (
    <ul className="bg-black rounded-xl bg-opacity-75 p-2">
      <p
        className="text-sm flex justify-end hover:text-yellow-400 transition duration-300"
        onClick={() => setAllRead(!allRead)}
      >
        Mark all as read
      </p>
      {notifications.map((notif) => {
        const { id, title, link, time, description } = notif;
        return (
          <li
            key={id}
            className="hover:bg-gray-80 rounded-lg transition duration-300 px-2"
          >
            <Link to={link}>
              <div className="flex flex-col">
                <p
                  className={`text-md text-yellow-300 ${
                    allRead && "opacity-75"
                  }`}
                >
                  {title}
                </p>
                <p
                  className={`text-base font-light ${allRead && "opacity-75"}`}
                >
                  {description}
                </p>
                <p
                  className={`${
                    !allRead && "text-yellow-300"
                  } flex items-end justify-end text-sm opacity-75`}
                >
                  {time}min ago
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
