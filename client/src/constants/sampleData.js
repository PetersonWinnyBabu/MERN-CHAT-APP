export const sampleChats = [
  {
    avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/women/1.jpg",
      "https://randomuser.me/api/portraits/men/2.jpg ",
    ],
    name: "Jane Doe",
    _id: "2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: ["https://randomuser.me/api/portraits/women/1.jpg"],
    name: "Jane Doe",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
      name: "John Doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
      name: "Jane Doe",
    },

    _id: "2",
  },
];

export const samplemessages = [
  {
    attachments: [
      {
        public_id: "asdasdsda",
        url: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    ],
    content: "L ka message hai",
    _id: "fhjsdgkhjsdfkds",
    sender: {
      _id: "user._id",
      name: "chaman",
    },
    chat: "chatId",
    createdAt: new Date().toISOString(),
  },

  {
    attachments: [
      {
        public_id: "asdasdsda 2 ",
        url: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    ],
    content: "L ka sdfjkhg message hai",
    _id: "fhjsdgkahjsdfkds",
    sender: {
      _id: "dghvfksdhjfg",
      name: "chaman 2 ",
    },
    chat: "chatId",
    createdAt: new Date().toISOString(),
  },
];

export const sampleDashboardData = {
  users: [
    {
      avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
      name: "John Doe",
      _id: "1",
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      avatar: ["https://randomuser.me/api/portraits/women/1.jpg"],
      name: "Jane Doe",
      _id: "2",
      username: "jane_doe",
      friends: 43,
      groups: 17,
    },
  ],
  chats: [
    {
      avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
      name: "John's Group",
      _id: "1",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { _id: "2", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { _id: "3", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      ],
      totalMembers: 2,
      totalMessages: 30,
      creator: {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    },
    {
      avatar: ["https://randomuser.me/api/portraits/women/1.jpg"],
      name: "Jane's Group",
      _id: "2",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { _id: "2", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
        { _id: "3", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
      ],
      totalMembers: 2,
      totalMessages: 30,
      creator: {
        name: "Jane Doe",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    },
    {
      avatar: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg ",
      ],
      name: "JaneMan Group",
      _id: "3",
      groupChat: true,
      members: [
        { _id: "1", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        { _id: "2", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        { _id: "3", avatar: "https://randomuser.me/api/portraits/men/7.jpg" },
      ],
      totalMembers: 4,
      totalMessages: 300,
      creator: {
        name: "Jaan",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      },
    },
  ],
  messages: [
    {
      attachments: [],
      content: "L ka message hai",
      _id: "fhjsdgkhjsdfkds",
      sender: {
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        name: "chaman",
      },
      chat: "chatId",
      groupChat: true,
      createdAt: new Date().toISOString(),
    },

    {
      attachments: [
        {
          public_id: "asdasdsda 2 ",
          url: "https://randomuser.me/api/portraits/women/43.jpg",
        },
      ],
      content: "L ka sdfjkhg message hai",
      _id: "fhjsdgkahjsdfkds",
      sender: {
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        name: "chyawan prash",
      },
      chat: "chatId",
      groupChat: false,
      createdAt: new Date().toISOString(),
    },
  ],
};
