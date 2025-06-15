
-- Function to update product stock based on a new stock movement
create or replace function public.update_product_stock_on_movement()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'INSERT') then
    if (new.tipo = 'entrada') then
      update public.produtos
      set quantidade_estoque = quantidade_estoque + new.quantidade
      where id = new.produto_id;
    elsif (new.tipo = 'saida') then
      -- We get the current stock to check if it's sufficient
      if ((select p.quantidade_estoque from public.produtos p where p.id = new.produto_id) >= new.quantidade) then
        update public.produtos
        set quantidade_estoque = quantidade_estoque - new.quantidade
        where id = new.produto_id;
      else
        -- If stock is insufficient, raise an exception to prevent the movement
        raise exception 'Estoque insuficiente para realizar a saída.';
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- Drop existing trigger if it exists to avoid errors on re-run
drop trigger if exists on_stock_movement_insert on public.movimentacao_estoque;

-- Trigger to execute the function after a new stock movement is inserted
create trigger on_stock_movement_insert
after insert on public.movimentacao_estoque
for each row
execute function public.update_product_stock_on_movement();
