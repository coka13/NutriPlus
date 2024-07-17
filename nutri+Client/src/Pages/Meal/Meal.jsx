import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,TextField,
  List,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import MealList from "../../Components/MealList/MealList";
import "./Meal.css";
import MealCarousel from "../../Components/MealCarousel/MealCarousel";
import { fetchAllRecipes } from "../store/slices/recipesSlice";
import { fetchAllMeals } from "../store/slices/mealSlice";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios"; // Import Axios

const Meal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState();
  const [selectedDish, setSelectedDish] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const meals = useSelector((state) => state.meals.meals);
  const dishes = useSelector((state) => state.recipes.recipes);
  const user= useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllRecipes());
    dispatch(fetchAllMeals(user._id));
  }, []);
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedDish(null);
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const payload = { name:foodName,  user: user._id, recipes: recipes.map((f) => f._id) };
      const response = await axios.post(
        `http://localhost:3000/api/meal/meals`,
        payload
      );
      dispatch(fetchAllMeals());
      setOpenModal(false); // Close the modal
   
    } catch (error) {
      console.log("Error occured",error)
      if (error.response) {
        if (error.response.status === 409) {
          setErrorMessage("Meal already exists. Please try again.");
        }
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const handleDishChange = (e) => {
    const selectedRecipe = dishes.find(
      (dish) => dish.recipeName === e.target.value
    );
    setSelectedDish(selectedRecipe);
  };
  const handleDeleteRecipe = (index) => {
    const tempFood = { ...recipes };
    tempFood.splice(index, 1);
    setRecipes(tempFood);
  };
  const handleAddNewRecipe = () => {
    if(!selectedRecipe) {return;}
    const rec = dishes.find((r) => r._id === selectedRecipe);
    setRecipes([...recipes, rec] );
    setSelectedRecipe();
  };

  return (
    <div className="meal-container">
      <Button
        type="button"
        variant="contained"
        color="primary"
        sx={{
          marginTop: "10px",
          marginBottom: "10px",
          backgroundColor: "#B81D33",
          "&:hover": {
            backgroundColor: "#B81D33",
          },
        }}
        onClick={handleModalOpen}
      >
        Add Food
      </Button>

      <Modal
      open={openModal}
      onClose={handleModalClose}
      aria-labelledby="food-details-modal"
      aria-describedby="modal-for-entering-food-details"
      BackdropProps={{
        invisible: true, // Hides the backdrop
      }}  
    >
      <div className="modal-content">
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          className="modal-title"
        >
          Add Food
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Food Name"
            value={foodName ?? ""}
            onChange={e=>setFoodName(e.target.value)}
            fullWidth
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="food-name-label">Add Recipe</InputLabel>
              <Select
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                labelId="food-name-label"
                label="Food Name"
                required
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "black",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#B81D33",
                    },
                    "&:hover fieldset": {
                      borderColor: "#B81D33",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#B81D33",
                    },
                  },
                }}
              >
                {dishes.map((dish) => (
                  <MenuItem key={dish._id} value={dish._id}>
                    {dish.recipeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <AddIcon fontSize="large" onClick={handleAddNewRecipe} />
          </div>
          <List sx={{ width: "100%",  }}>
            {recipes?.length > 0 &&
             recipes.map((dish, index) => (
                <React.Fragment key={dish._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={dish.recipeName} src={dish.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={dish.recipeName}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {dish.description}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <CloseIcon onClick={() => handleDeleteRecipe(index)} />
                  </ListItem>
                </React.Fragment>
              ))}
          </List>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
              backgroundColor: "#B81D33",
              "&:hover": {
                backgroundColor: "#B81D33",
              },
            }}
          >
            Add Meal
          </Button>
        </form>
      </div>
    </Modal>
     
      <div className="meal-list">
        <MealList setDishes={setFoodList} dishes={foodList} />
      </div>
      <MealCarousel meals={meals} />
       </div>
  );
};

export default Meal; // Export the Meal component as the default export
