import { adotanteRepository as repo } from "./adotante.repo";
import { ConflictError, NotFoundError } from "../../utils/errors";
import type { CreateAdotanteDTO, UpdateAdotanteDTO } from "./adotante.types";
function validarCoerencia(d: { possui_animais: boolean; quantidade_animais: number }) {
  if ((!d.possui_animais && d.quantidade_animais !== 0) || (d.possui_animais && d.quantidade_animais === 0)) {
    throw new ConflictError("Quantidade de animais incompatível com possui_animais");
  }
}
function tratarErro(error: unknown): never {
  const code = (error as {sqlState?: string})?.sqlState;
  if (code === "23505") throw new ConflictError("CPF já cadastrado");
  if (code === "23503") throw new ConflictError("Adotante possui solicitações vinculadas");
  throw error;
}
export const adotanteService = {
  getAll: () => repo.findAll(),
  findById: async (id: number) => {
    const item = await repo.findById(id);
    if (!item) throw new NotFoundError("Adotante não encontrado");
    return item;
  },
  create: async (dados: CreateAdotanteDTO) => {
    validarCoerencia(dados);
    if (await repo.findByCpf(dados.cpf)) throw new ConflictError("CPF já cadastrado");
    try { return await repo.create(dados); } catch (e) { tratarErro(e); }
  },
  update: async (id: number, dados: UpdateAdotanteDTO) => {
    const atual = await adotanteService.findById(id);
    validarCoerencia({ possui_animais: dados.possui_animais ?? atual.possui_animais, quantidade_animais: dados.quantidade_animais ?? atual.quantidade_animais });
    if (dados.cpf) {
      const outro = await repo.findByCpf(dados.cpf);
      if (outro && outro.id_adotante !== id) throw new ConflictError("CPF já cadastrado");
    }
    try { return await repo.update(id, dados); } catch (e) { tratarErro(e); }
  },
  delete: async (id: number) => {
    await adotanteService.findById(id);
    try { return await repo.delete(id); } catch (e) { tratarErro(e); }
  },
};
