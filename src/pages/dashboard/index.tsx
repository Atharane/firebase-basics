import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
    getDocs,
    onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import {
  Modal,
  Button,
  Group,
  createStyles,
  TextInput,
  NumberInput,
  FileInput,
} from "@mantine/core";

const firebaseConfig = {
  apiKey: "AIzaSyCfW40E9B2YIj-dF04-EGfnWrg_c71N3yQ",
  authDomain: "fir-basics-5a98d.firebaseapp.com",
  projectId: "fir-basics-5a98d",
  storageBucket: "fir-basics-5a98d.appspot.com",
  messagingSenderId: "865396837361",
  appId: "1:865396837361:web:06eee03e547bf08ce81250",
  measurementId: "G-FPPN42G1ZZ",
};

const app = await initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "plants");

// getDocs(collectionRef)
//   .then((querySnapshot) => {
//     let plants: any = [];
//     querySnapshot.forEach((doc) => {
//       plants.push({ id: doc.id, ...doc.data() });
//     });
//     console.log(plants);
//   })
//   .catch((error) => {
//     console.log("Error getting documents: ", error);
//   });

// handle realtime data
onSnapshot(collectionRef, (querySnapshot) => {
    let plants: any = [];
    querySnapshot.forEach((doc) => {
        plants.push({ id: doc.id, ...doc.data() });
    });
    console.log(plants);
});

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

export default function DashboardPage() {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  const [species, setSpecies] = useState("");
  const [age, setAge] = useState(0);
  const [documentId, setDocumentId] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addDoc(collectionRef, {
      species: species,
      age: age,
    }).then(() => {
      setSpecies("");
      setAge(0);
      setOpened(false);
    });
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    deleteDoc(doc(db, "plants", documentId))
      .then(() => {
        setDocumentId("");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a plant"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <FileInput
              placeholder="Pick file"
              label="Your resume"
              withAsterisk
            />
            <TextInput
              mt="md"
              label="Plant species"
              placeholder="Bamboo"
              classNames={classes}
              onChange={(e) => setSpecies(e.target.value)}
              value={species}
            />
            <NumberInput
              mt="md"
              label="Plant's age (in months)"
              placeholder="12"
              classNames={classes}
              onChange={(e: number) => setAge(e)}
              value={age}
            />

            <Button type="submit" mt="md" fullWidth>
              Submit
            </Button>
          </div>
        </form>
      </Modal>

      <Group position="center">
        <Button size="lg" mt="lg" onClick={() => setOpened(true)}>
          Open Modal
        </Button>
      </Group>

      <form onSubmit={handleDelete}>
        <div>
          <TextInput
            mt="md"
            label="Document ID"
            placeholder="G6Z4XH45H..."
            classNames={classes}
            onChange={(e) => setDocumentId(e.target.value)}
            value={documentId}
          />
          <Button type="submit" mt="md" fullWidth>
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
