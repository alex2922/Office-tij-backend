import { database } from "../db/config.js";
import Joi from "joi";

const supportingDataTableSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.object().required(),
});

export const addSupportingDataService = async (data) => {
  try {
    const { error, value } = supportingDataTableSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation Error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    const query = `INSERT INTO supportingData (name, value) VALUES (?, ?)`;
    const values = [value.name, value.value];
    const [results] = await database.query(query, values);
    return {
      success: true,
      message: "Supporting data added successfully",
      data: { id: results.insertId },
    };
  } catch (error) {
    console.error("Error in addSupportingDataService:", error);
    return {
      success: false,
      message: "Failed to add supporting data",
      error: error.message,
    };
  }
};

export const getAllSupportingDataService = async () => {
  try {
    const query = `SELECT * FROM supportingData`;
    const [results] = await database.query(query);
    return {
      success: true,
      message: "Supporting data fetched successfully",
      data: results,
    };
  } catch (error) {
    console.error("Error in getAllSupportingDataService:", error);
    return {
      success: false,
      message: "Failed to fetch supporting data",
      error: error.message,
    };
  }
};

export const getSupportingDataByIdService = async (id) => {
  try {
    const query = `SELECT * FROM supportingData WHERE id = ?`;
    const [results] = await database.query(query, [id]);
    if (results.length === 0) {
      throw new Error("Supporting data not found");
    }
    return {
      success: true,
      message: "Supporting data fetched successfully",
      data: results[0],
    };
  } catch (error) {
    console.error("Error in getSupportingDataByIdService:", error);
    return {
      success: false,
      message: "Failed to fetch supporting data",
      error: error.message,
    };
  }
};

export const updateSupportingDataService = async (id, data) => {
  try {
    const { error, value } = supportingDataTableSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation Error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    const query = `UPDATE supportingData SET name = ?, value = ? WHERE id = ?`;
    const values = [value.name, value.value, id];
    const [results] = await database.query(query, values);
    return {
      success: true,
      message: "Supporting data updated successfully",
      data: { id: results.insertId },
    };
  } catch (error) {
    console.error("Error in updateSupportingDataService:", error);
    return {
      success: false,
      message: "Failed to update supporting data",
      error: error.message, 
    };
  }
};

export const deleteSupportingDataService = async (id) => {
   try {
    const query = `DELETE FROM supportingData WHERE id = ?`;
    const [results] = await database.query(query, [id]);
    if(results.affectedRows === 0){
        throw new Error("Supporting data not found");
    }
    return {
      success: true,
      message: "Supporting data deleted successfully",
      data: { id: results.insertId },
    };
  } catch (error) {
    console.error("Error in deleteSupportingDataService:", error);
    return {
      success: false,
      message: "Failed to delete supporting data",
      error: error.message,
    };
  }
};
