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
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { fetchAllMeals } from "../store/slices/mealSlice";
import { fetchAllRecipes } from "../store/slices/recipesSlice";
const UpdateMeal = ({ openModal, handleModalClose, meal }) => {
  const userId = useSelector((state) => state.auth.user._id);
  const allRecipes = useSelector((state) => state.recipes.recipes);
  const dispatch = useDispatch();
  const [food, setFood] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState();
  const fetchMeal = async () => {
    const meals = await axios.get(
      `http://localhost:3000/api/meal/${userId}/meals/${meal._id}`
    );
    setFood(meals.data);
  };

  const handleFoodNameChange = (e) => {
    setFood({ ...food, name:e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      const payload = { ...food, recipes: food.recipes.map((f) => f._id) };
      const response = await axios.put(
        `http://localhost:3000/api/meal/userId/meals/${meal._id}`,
        payload
      );
      dispatch(fetchAllMeals());
      handleModalClose();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setErrorMessage("Meal already exists. Please try again.");
        }
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };
  useEffect(() => {
    fetchMeal();
    dispatch(fetchAllRecipes());
  }, []);
  const handleDeleteRecipe = (index) => {
    const tempFood = { ...food };
    tempFood.recipes.splice(index, 1);
    setFood(tempFood);
  };
  const handleAddNewRecipe = () => {
    const rec = allRecipes.find((r) => r._id === selectedRecipe);
    console.log(rec, selectedRecipe);
    setFood({ ...food, recipes: [...food.recipes, rec] });
    setSelectedRecipe();
  };
  return (
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
          Update Food
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Food Name"
            value={food?.name ?? ""}
            onChange={handleFoodNameChange}
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
                {allRecipes.map((dish) => (
                  <MenuItem key={dish._id} value={dish._id}>
                    {dish.recipeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <AddIcon fontSize="large" onClick={handleAddNewRecipe} />
          </div>
          <List sx={{ width: "100%",  }}>
            {food?.recipes?.length > 0 &&
              food.recipes.map((dish, index) => (
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
            Update Food
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateMeal;