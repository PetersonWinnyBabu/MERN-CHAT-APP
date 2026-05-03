import { Dialog, DialogTitle, Stack, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";

const AddMembersDialog = ({ addMember, isLoadingAddMember, chatId }) => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentId) => currentId !== id)
        : [...prev, id]
    );
  };

  const addmemberSubmitHandler = () => {
    closeHandler();
  };

  const closeHandler = () => {
    setSelectedMembers([]);
    setMembers([]);
  };

  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {members.length > 0 ? (
            members.map((each) => (
              <UserItem
                key={each._id}
                user={each}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(each._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>

        <Button color="error" variant="outlined" onClick={closeHandler}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isLoadingAddMember}
          onClick={addmemberSubmitHandler}
        >
          Submit Changes
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddMembersDialog;
