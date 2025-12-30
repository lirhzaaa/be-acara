import mongoose from "mongoose";

const villageSchema = new mongoose.Schema({
  id: { type: Number, index: true },
  name: String,
});

const districtSchema = new mongoose.Schema({
  id: { type: Number, index: true },
  name: String,
  villages: [villageSchema],
});

const regencySchema = new mongoose.Schema({
  id: { type: Number, index: true },
  name: String,
  districts: [districtSchema],
});

const provinceSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    name: String,
    regencies: [regencySchema],
  },
  {
    statics: {
      async findByCity(this: any, cityName: string) {
        return this.aggregate([
          { $unwind: "$regencies" },
          {
            $match: {
              "regencies.name": { $regex: cityName, $options: "i" },
            },
          },
          {
            $project: {
              id: "$regencies.id",
              name: "$regencies.name",
              province: "$name",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                id: "$id",
                name: "$name",
                province: "$province",
              },
            },
          },
        ]);
      },

      async getAllProvinces(this: any) {
        return this.find({}).select("id name -_id");
      },

      async getProvince(this: any, provinceId: number) {
        return this.aggregate([
          { $match: { id: provinceId } },
          {
            $project: {
              id: 1,
              name: 1,
              regencies: {
                $map: {
                  input: "$regencies",
                  as: "r",
                  in: { id: "$$r.id", name: "$$r.name" },
                },
              },
            },
          },
          { $replaceRoot: { newRoot: "$$ROOT" } },
        ]);
      },

      async getRegency(this: any, regencyId: number) {
        return this.aggregate([
          { $unwind: "$regencies" },
          { $match: { "regencies.id": regencyId } },
          {
            $project: {
              id: "$regencies.id",
              name: "$regencies.name",
              province: { id: "$id", name: "$name" },
              districts: {
                $map: {
                  input: "$regencies.districts",
                  as: "d",
                  in: { id: "$$d.id", name: "$$d.name" },
                },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                id: "$id",
                name: "$name",
                province: "$province",
                districts: "$districts",
              },
            },
          },
        ]);
      },

      async getDistrict(this: any, districtId: number) {
        return this.aggregate([
          { $unwind: "$regencies" },
          { $unwind: "$regencies.districts" },
          { $match: { "regencies.districts.id": districtId } },
          {
            $project: {
              id: "$regencies.districts.id",
              name: "$regencies.districts.name",
              province: { id: "$id", name: "$name" },
              regency: { id: "$regencies.id", name: "$regencies.name" },
              villages: {
                $map: {
                  input: "$regencies.districts.villages",
                  as: "v",
                  in: { id: "$$v.id", name: "$$v.name" },
                },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                id: "$id",
                name: "$name",
                province: "$province",
                regency: "$regency",
                villages: "$villages",
              },
            },
          },
        ]);
      },

      async getVillage(this: any, villageId: number) {
        return this.aggregate([
          { $unwind: "$regencies" },
          { $unwind: "$regencies.districts" },
          { $unwind: "$regencies.districts.villages" },
          { $match: { "regencies.districts.villages.id": villageId } },
          {
            $project: {
              id: "$regencies.districts.villages.id",
              name: "$regencies.districts.villages.name",
              province: { id: "$id", name: "$name" },
              regency: { id: "$regencies.id", name: "$regencies.name" },
              district: {
                id: "$regencies.districts.id",
                name: "$regencies.districts.name",
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                id: "$id",
                name: "$name",
                province: "$province",
                regency: "$regency",
                district: "$district",
              },
            },
          },
        ]);
      },
    },
  }
);


const RegionModel = mongoose.model("Region", provinceSchema);
export default RegionModel;