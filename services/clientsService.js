import { database } from "../db/config";
import Joi from "joi";

const clientsTableSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.email().required(),
  contact: Joi.string().required(),
  gstnum: Joi.date().optional(),
  address: Joi.string().optional(),
});

export const addClientService = async (data) => {
  try {
    const { error, value } = clientsTableSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation Error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    const query = `INSERT INTO clients (name, email, contact, gstnum, address) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      value.name,
      value.email,
      value.contact,
      value.gstnum,
      value.address,
    ];
    const [results] = await database.query(query, values);
    return {
      success: true,
      message: "Client added successfully",
      data: { id: results.insertId },
    };
  } catch (error) {
    console.error("Error in addClientService:", error);
    return {
      success: false,
      message: "Failed to add client",
      error: error.message,
    };
  }
};

export const getAllClientsService = async () => {
  try {
    const query = `SELECT * FROM clients`;
    const [results] = await database.query(query);
    return {
      success: true,
      message: "Clients fetched successfully",
      data: results,
    };
  } catch (error) {
    console.error("Error in getAllClientsService:", error);
    return {
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    };
  }
};

export const getClientByIdService = async (id) => {
  try {
    const query = `SELECT * FROM clients WHERE id = ?`;
    const [results] = await database.query(query, [id]);
    if (results.length === 0) {
      throw new Error("Client not found");
    }
    return {
      success: true,
      message: "Client fetched successfully",
      data: results[0],
    };
  } catch (error) {
    console.error("Error in getClientByIdService:", error);
    return {
      success: false,
      message: "Failed to fetch client",
      error: error.message,
    };
  }
};

export const updateClientService = async (id, data) => {
  try {
    const { error, value } = clientsTableSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation Error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    const query = `UPDATE clients SET name = ?, email = ?, contact = ?, gstnum = ?, address = ? WHERE id = ?`;
    const values = [
      value.name,
      value.email,
      value.contact,
      value.gstnum,
      value.address,
      id,
    ];
    const [result] = await database.query(query, values);

    if (result.affectedRows === 0) {
      throw new Error("Client not found");
    }
    return {
      success: true,
      message: "Client updated successfully",
      data: { id: result.insertId },
    };
  } catch (error) {
    console.error("Error in updateClientService:", error);
    return {
      success: false,
      message: "Failed to update client",
      error: error.message,
    };
  }
};

export const deleteClientService = async (id) => {
  try {
    const query = `DELETE FROM clients WHERE id = ?`;
    const [result] = await database.query(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error("Client not found");
    }
    return {
      success: true,
      message: "Client deleted successfully",
      data: { id: result.insertId },
    };
  } catch (error) {
    console.error("Error in deleteClientService:", error);
    return {
      success: false,
      message: "Failed to delete client",
      error: error.message,
    };
  }
};
