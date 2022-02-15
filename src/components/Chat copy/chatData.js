var conversations = [
  {
    id: "Ufd1",
    fullName: "Reda SELLAK",
    avatar:
      "https://res.cloudinary.com/dmtgbbfs5/image/upload/v1622750652/yav8agov1lirpm8yuipb.jpg",
    lastMessage: new Date("2021-09-04 11:12"),
    messages: [
      {
        type: "text",
        text: "Hello",
        incoming: true,
      },
    ],
  },
  {
    id: "Ufd2",
    fullName: "Creator 1",
    avatar:
      "https://res.cloudinary.com/dmtgbbfs5/image/upload/v1622750652/yav8agov1lirpm8yuipb.jpg",
    lastMessage: new Date("2021-09-04 11:12"),
    messages: [
      {
        type: "text",
        text: "Hello",
        incoming: true,
      },
      { type: "text", text: "Hello there", incoming: false },
    ],
  },
  {
    id: "Ufd3",
    fullName: "creator 2",
    avatar:
      "https://res.cloudinary.com/dmtgbbfs5/image/upload/v1622750652/yav8agov1lirpm8yuipb.jpg",
    lastMessage: new Date("2021-09-04 00:12"),
    lastMessageText: "",
    messages: [
      {
        type: "text",
        text: "Hello",
        incoming: false,
      },
    ],
  },
  {
    id: "Ufd4",
    fullName: "creator 3",
    avatar:
      "https://res.cloudinary.com/dmtgbbfs5/image/upload/v1622750652/yav8agov1lirpm8yuipb.jpg",
    lastMessage: new Date("2021-09-04 22:03"),
    lastMessageText: "yes will do",
    messages: [
      {
        type: "text",
        text: "Hello",
        incoming: false,
        messageTime: new Date("2021-09-04 22:03"),
      },
    ],
  },
];

export default conversations;
