// Data Transfer Object for Pet Updates
export class PetUpdateDTO {
    constructor(pet = {}) {
        this.petName = pet.petName || '';
        this.species = pet.species || '';
        this.breed = pet.breed || '';
        this.age = parseInt(pet.age) || 0;
        this.weight = parseFloat(pet.weight) || 0.0;
        this.medRec = pet.medRec || '';
    }

    toJSON() {
        return {
            petName: this.petName.trim(),
            species: this.species.trim(),
            breed: this.breed.trim(),
            age: this.age,
            weight: this.weight,
            medRec: this.medRec.trim()
        };
    }
}
