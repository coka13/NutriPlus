import {
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCarousel from "../../Components/ShoppingCarousel/ShoppingCarousel";
import { fetchAllRecipes } from "../store/slices/recipesSlice";
import { fetchAllShoppingLists } from "../store/slices/shoppingSlice";
import "./Shopping.css";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { fetchAllMeals } from "../store/slices/mealSlice";

const UpdateShopping = ({ openModal, handleModalClose, shopping }) => {
  console.log(shopping);
  const [shoppingListName, setShoppingListName] = useState(shopping?.name);
  const [selectedFood, setSelectedFood] = useState();
  const [selectedShoppingList, setSelectedShoppingList] = useState([]);
  const [ingredients, setIngredients] = useState(shopping?.items); //contains all ingredients
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const userID = useSelector((state) => state.auth.user._id);
  const recipes = useSelector((state) => state.recipes.recipes);
  const meals = useSelector((state) => state.meals.meals);

  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const items = [...ingredients];
      selectedShoppingList.forEach((meal) => {
        meal?.recipes.forEach((rec)=>{
          rec?.ingredients.forEach((ing)=>{
            items.push({ingredient:ing.ingredient,quantity:ing.quantity,unit:ing.unit});
          })
        })
      });

      const res = await axios.put(
        `http://localhost:3000/api/shopping/${userID}/shoppingLists/${shopping._id}`,
        {
          name: shoppingListName,
          items: items.flat(),
        }
      );
      handleModalClose();
      dispatch(fetchAllShoppingLists());
    } catch (err) {
      console.error("Failed to update shopping list:", err);
    }
  };

  // Fetch all shopping lists for the user
  useEffect(() => {
    // dispatch(fetchAllRecipes());
    dispatch(fetchAllMeals());
    dispatch(fetchAllShoppingLists());
  }, []);

  const handleFoodSelection = () => {
    const tempList = [...selectedShoppingList];
    tempList.push(meals.find((meal) => meal._id === selectedFood));
    setSelectedShoppingList(tempList);
  };

  const handleFoodRemove = (index) => {
    const tempList = [...selectedShoppingList];
    tempList.splice(index, 1);
    setSelectedShoppingList(tempList);
  };

  const handleIngredientRemove = (index) => {
    const tempList = [...ingredients];
    tempList.splice(index, 1);
    setIngredients(tempList);
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
          Update Shopping List Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            type="text"
            value={shoppingListName}
            onChange={(e) => setShoppingListName(e.target.value)}
            label="Shooping List Name"
            fullWidth
            variant="outlined"
            margin="normal"
            className="input-field"
            sx={{
              marginBottom: "10px",
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
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl
              fullWidth
              variant="outlined"
              margin="normal"
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
              <InputLabel id="food-label">Select Meal</InputLabel>
              <Select
                labelId="food-label"
                id="food"
                label="Select Food"
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
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
                {meals?.length > 0 &&
                    meals.map((r) => {
                      return <MenuItem value={r._id}>{r.name}</MenuItem>;
                    })}
              </Select>
            </FormControl>
            <AddIcon fontSize="large" onClick={handleFoodSelection} />
          </div>
          {selectedShoppingList?.length > 0 && (
            <>
              <Typography variant="h6">Selected Food:</Typography>
              <List>
                {selectedShoppingList.map((food, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ color: darkMode ? "#fff" : "black" }}>
                          {food.name}
                          </span>
                          <CloseIcon onClick={() => handleFoodRemove(index)} />
                        </div>
                      }
                      secondary={
                        <span style={{ color: darkMode ? "white" : "grey" }}>
                          {food.recipes.map(({ingredients}) => {
                            return ingredients.map((ing) => {
                              return `${ing.ingredient} ${ing.quantity} ${ing.unit}`;
                            });
                          })}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          {ingredients?.length > 0 && (
            <>
              <Typography variant="h6">Existing Ingredients:</Typography>
              <List>
                {ingredients.map((ing, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ color: darkMode ? "#fff" : "black" }}>
                            {ing.ingredient}
                          </span>
                          <CloseIcon
                            onClick={() => handleIngredientRemove(index)}
                          />
                        </div>
                      }
                      secondary={
                        <span style={{ color: darkMode ? "white" : "grey" }}>
                          {ing.quantity} {ing.unit}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

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
            Update Shopping List
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateShopping;
