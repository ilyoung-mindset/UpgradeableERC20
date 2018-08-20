const { assertBalance, expectThrow, ZERO_ADDRESS } = require('./helpers/common');
var BigNumber = require("bignumber.js");

function Token_V0_Tests(owner, tokenHolder, otherAccount) {
    describe("Behaves properly like a Pausable, Burnable, Mintable, Standard ERC20 token", function () {
        describe('--BasicToken Tests--', function () {

            describe('total supply', function () {
                it('returns the total amount of tokens', async function () {
                    const totalSupply = await this.token_V0.totalSupply()
                    assert(totalSupply.eq(0))
                })
            })
            
            describe('balanceOf', function () {
                describe('when the requested account has no tokens', function () {
                    it('returns zero', async function () {
                        await assertBalance(this.token_V0, owner, 0)
                    })
                })
                
                describe('when the requested account has some tokens', function () {
                    it('returns the total amount of tokens', async function () {
                        await assertBalance(this.token_V0, tokenHolder, this.initialSeed)
                    })
                })
            })
            
            describe('transfer', function () {
                describe('when the anotherAccount is not the zero address', function () {
                    const to = otherAccount
                    
                    describe('when the sender does not have enough balance', function () {
                        const amount = 11 * 10 ** 18
                        
                        it('reverts', async function () {
                            await expectThrow(this.token_V0.transfer(to, amount, { from: tokenHolder }))
                        })
                    })
                    
                    describe('when the sender has enough balance', function () {
                        const amount = 10 * 10 ** 18
                        
                        it('transfers the requested amount', async function () {
                            await this.token_V0.transfer(to, amount, { from: tokenHolder })
                            await assertBalance(this.token_V0, tokenHolder, 0)
                            await assertBalance(this.token_V0, to, amount)
                        })
                        
                        it('emits a transfer event', async function () {
                            const { logs } = await this.token_V0.transfer(to, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Transfer')
                            assert.equal(logs[0].args.from, tokenHolder)
                            assert.equal(logs[0].args.to, to)
                            assert(logs[0].args.value.eq(amount))
                        })
                    })
                })
            })
        })
        
        
        describe('--StandardToken Tests--', function () {
            
            describe('approve', function () {
                describe('when the spender is not the zero address', function () {
                    const spender = otherAccount
                    
                    describe('when the sender has enough balance', function () {
                        const amount = 10 * 10 ** 18
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.token_V0.approve(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.eq(amount))
                        })
                        
                        describe('when there was no approved amount before', function () {
                            it('approves the requested amount', async function () {
                                await this.token_V0.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.token_V0.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                        
                        describe('when the spender had an approved amount', function () {
                            beforeEach(async function () {
                                await this.token_V0.approve(spender, amount, { from: tokenHolder })
                            })
                            
                            it('approves the requested amount and replaces the previous one', async function () {
                                await this.token_V0.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.token_V0.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                    })
                    
                    describe('when the sender does not have enough balance', function () {
                        const amount = 11 * 10 ** 18
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.token_V0.approve(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.eq(amount))
                        })
                        
                        describe('when there was no approved amount before', function () {
                            it('approves the requested amount', async function () {
                                await this.token_V0.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.token_V0.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                        
                        describe('when the spender had an approved amount', function () {
                            beforeEach(async function () {
                                await this.token_V0.approve(spender, amount, { from: tokenHolder })
                            })
                            
                            it('approves the requested amount and replaces the previous one', async function () {
                                await this.token_V0.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.token_V0.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                    })
                })
                
                describe('when the spender is the zero address', function () {
                    const amount = 10 * 10 ** 18
                    const spender = ZERO_ADDRESS
                    
                    it('approves the requested amount', async function () {
                        await this.token_V0.approve(spender, amount, { from: tokenHolder })
                        
                        const allowance = await this.token_V0.allowance(tokenHolder, spender)
                        assert(allowance.eq(amount))
                    })
                    
                    it('emits an approval event', async function () {
                        const { logs } = await this.token_V0.approve(spender, amount, { from: tokenHolder })
                        
                        assert.equal(logs.length, 1)
                        assert.equal(logs[0].event, 'Approval')
                        assert.equal(logs[0].args.owner, tokenHolder)
                        assert.equal(logs[0].args.spender, spender)
                        assert(logs[0].args.value.eq(amount))
                    })
                })
            })
            
            describe('transfer from', function () {
                const spender = otherAccount
                

                describe('when the recipient is not the zero address', function () {
                    const to = owner
                    
                    describe('when the spender has enough approved balance', function () {
                        beforeEach(async function () {
                            await this.token_V0.approve(spender, 10 * 10 ** 18, { from: tokenHolder })
                        })
                        
                        describe('when the token holder has enough balance', function () {
                            const amount = 10 * 10 ** 18
                            
                            it('transfers the requested amount', async function () {
                                await this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender })
                                await assertBalance(this.token_V0, tokenHolder, 0)
                                await assertBalance(this.token_V0, to, amount)
                            })
                            
                            it('decreases the spender allowance', async function () {
                                await this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender })
                                
                                const allowance = await this.token_V0.allowance(tokenHolder, spender)
                                assert(allowance.eq(0))
                            })
                            
                            it('emits a transfer event', async function () {
                                const { logs } = await this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Transfer')
                                assert.equal(logs[0].args.from, tokenHolder)
                                assert.equal(logs[0].args.to, to)
                                assert(logs[0].args.value.eq(amount))
                            })
                            

                        })
                        
                        describe('when the token holder does not have enough balance', function () {
                            const amount = 11 * 10 ** 18
                            
                            it('reverts', async function () {
                                await expectThrow(this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender }))
                            })
                        })
                    })
                    
                    describe('when the spender does not have enough approved balance', function () {
                        beforeEach(async function () {
                            await this.token_V0.approve(spender, 9 * 10 ** 18, { from: tokenHolder })
                        })
                        
                        describe('when the token holder has enough balance', function () {
                            const amount = 10 * 10 ** 18
                            
                            it('reverts', async function () {
                                await expectThrow(this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender }))
                            })
                        })
                        
                        describe('when the token holder does not have enough balance', function () {
                            const amount = 11 * 10 ** 18
                            
                            it('reverts', async function () {
                                await expectThrow(this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender }))
                            })
                        })
                    })
                })
                
                describe('when the recipient is the zero address', function () {
                    const amount = 10 * 10 ** 18
                    const to = ZERO_ADDRESS
                    
                    beforeEach(async function () {
                        await this.token_V0.approve(spender, amount, { from: tokenHolder })
                    })
                    
                    it('reverts', async function () {
                        await expectThrow(this.token_V0.transferFrom(tokenHolder, to, amount, { from: spender }))
                    })
                })

            })
        })
        
    })
}

module.exports = {
    Token_V0_Tests
}